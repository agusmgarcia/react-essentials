import type {} from "@redux-devtools/extension";

import { type Const } from "@agusmgarcia/react-essentials-utils";

import GlobalSlice from "#src/GlobalSlice";

import createMiddleware from "./Store.createMiddleware";
import setupDevTools from "./Store.setupDevtools";
import {
  type BaseSliceFactories,
  type Configs,
  type Input,
  type Listener,
  type Middleware,
  type SlicesOf,
  type StateOf,
  type Unsubscribe,
} from "./Store.types";

export default class Store<TSliceFactories extends BaseSliceFactories> {
  private readonly _configs: Const<Configs<TSliceFactories>, "shallow">;
  private readonly _listeners: Listener<TSliceFactories>[];
  private readonly _slices: Const<SlicesOf<TSliceFactories>, "shallow">;
  private readonly _state: Const<StateOf<TSliceFactories>, "shallow">;

  private _subscriptionIndex: number;

  constructor(...[sliceFactories, configs]: Input<TSliceFactories>) {
    this._configs = configs || ({} as Configs<TSliceFactories>);
    this._listeners = [];

    this._slices = Object.keys(sliceFactories).reduce((result, key) => {
      const sliceFactory = sliceFactories[key];
      const params = (configs?.params as any)?.[key] || [];

      const slice = getGlobalSlice(new sliceFactory(...params));
      slice["slices"] = result;

      result[key as keyof TSliceFactories] =
        slice as SlicesOf<TSliceFactories>[string];
      return result;
    }, {} as SlicesOf<TSliceFactories>);

    const middleware = createMiddleware<TSliceFactories>(
      Array.isArray(this._configs.middlewares)
        ? this._configs.middlewares
        : typeof this._configs.middlewares !== "undefined"
          ? ([
              this._configs.middlewares,
            ] as unknown as Middleware<TSliceFactories>[])
          : [],
    );

    this._state = Object.keys(this._slices).reduce((result, key) => {
      result[key as keyof typeof result] = new Proxy(
        getGlobalSlice(this._slices[key]),
        new EnhancedSliceProxyHandler(
          this._slices as Const<StateOf<TSliceFactories>, "shallow">,
          middleware,
        ),
      );
      return result;
    }, {} as StateOf<TSliceFactories>);

    this._subscriptionIndex = Number.MIN_SAFE_INTEGER;
  }

  init(): void {
    setupDevTools(this, this._configs?.devTools);

    Object.keys(this._slices).forEach((key) => {
      const slice = getGlobalSlice(this._slices[key]);

      const handleSubscribe = () => {
        const subscriptionIndex = ++this._subscriptionIndex;

        this._listeners.forEach((listener) => {
          if (subscriptionIndex !== this._subscriptionIndex) return;
          listener(this.state);
        });
      };

      slice.subscribe(handleSubscribe);
    });

    Object.keys(this._slices).forEach((key) => {
      const slice = getGlobalSlice(this._slices[key]);

      slice["onInit"]();

      if (!slice["_initialized"])
        throw new Error(`'${slice.constructor.name}' must call super.onInit()`);
    });
  }

  get state(): Const<StateOf<TSliceFactories>, "shallow"> {
    return this._state;
  }

  subscribe(listener: Listener<TSliceFactories>): Unsubscribe {
    this._listeners.push(listener);
    return () => this._listeners.splice(this._listeners.indexOf(listener), 1);
  }
}

function getGlobalSlice(maybeSlice: any): GlobalSlice<any, any> {
  if (!(maybeSlice instanceof GlobalSlice))
    throw new Error(
      `'${maybeSlice.constructor.name}' must extend from ${GlobalSlice.constructor.name}`,
    );

  return maybeSlice;
}

class EnhancedSliceProxyHandler<
  TSlice extends GlobalSlice<any, any>,
  TSliceFactories extends BaseSliceFactories,
> implements ProxyHandler<TSlice>
{
  private readonly metods: Record<string, any>;
  private readonly state: Const<StateOf<TSliceFactories>, "shallow">;
  private readonly middleware: Middleware<TSliceFactories>;

  constructor(
    state: Const<StateOf<TSliceFactories>, "shallow">,
    middleware: Middleware<TSliceFactories>,
  ) {
    this.metods = {};
    this.state = state;
    this.middleware = middleware;
  }

  get(target: any, property: string): any {
    if (!!this.metods[property]) return this.metods[property];

    const value = target[property];
    if (typeof value !== "function") return value;

    const boundValue = value.bind(target);
    const method = (...args: any) =>
      this.middleware(() => boundValue(...args), this.state);

    this.metods[property] = method;
    return method;
  }
}
