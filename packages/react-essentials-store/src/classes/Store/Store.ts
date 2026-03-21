import { type GlobalSlice } from "#src/classes";

import { createMiddleware } from "./createMiddleware";
import { setupDevTools } from "./setupDevTools";
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

/**
 * Represents a reactive store that manages multiple state slices, middleware, and listeners.
 *
 * @typeParam TSliceFactories - A mapping of slice names to their factory constructors.
 *
 * The `Store` class is responsible for:
 * - Instantiating and managing state slices using provided factories.
 * - Applying middleware to slice methods.
 * - Managing listeners for state changes.
 * - Integrating with development tools.
 */
export default class Store<TSliceFactories extends BaseSliceFactories> {
  private readonly configs: Configs<TSliceFactories>;
  private readonly listeners: Listener<TSliceFactories>[];
  private readonly slices: SlicesOf<TSliceFactories>;
  private readonly innerState: StateOf<TSliceFactories>;

  private subscriptionIndex: number;

  /**
   * Creates a new instance of the `Store` class, initializing slices, middleware, and internal state.
   *
   * @param sliceFactories - An object containing factory classes for each slice of the store.
   * @param configs - Optional configuration object for the store, including middleware, parameters for slice factories, and devTools options.
   *
   * @template TSliceFactories - The type representing the collection of slice factories.
   *
   * @remarks
   * - Initializes each slice using its corresponding factory and parameters.
   * - Sets up middleware for state management.
   * - Wraps each slice in a proxy to enhance state handling.
   * - Prepares internal listeners and subscription index for state change notifications.
   */
  constructor(...[sliceFactories, configs]: Input<TSliceFactories>) {
    this.configs = configs || ({} as Configs<TSliceFactories>);
    this.listeners = [];

    this.slices = Object.keys(sliceFactories).reduce((result, key) => {
      const sliceFactory = sliceFactories[key];
      const params = (configs?.params as any)?.[key] || [];

      const slice = new sliceFactory(...params);
      slice["slices"] = result;

      result[key as keyof TSliceFactories] =
        slice as SlicesOf<TSliceFactories>[string];

      return result;
    }, {} as SlicesOf<TSliceFactories>);

    const middleware = createMiddleware<TSliceFactories>(
      Array.isArray(this.configs.middlewares)
        ? this.configs.middlewares
        : typeof this.configs.middlewares !== "undefined"
          ? [this.configs.middlewares]
          : [],
    );

    this.innerState = Object.keys(this.slices).reduce((result, key) => {
      result[key as keyof typeof result] = new Proxy(
        this.slices[key],
        new SliceProxyHandler(this.slices, middleware),
      );
      return result;
    }, {} as StateOf<TSliceFactories>);

    this.subscriptionIndex = Number.MIN_SAFE_INTEGER;
  }

  /**
   * Initializes the store by setting up developer tools integration, subscribing to slice updates,
   * and invoking the initialization logic for each slice.
   *
   * @remarks
   * - Integrates with developer tools if configured.
   * - Subscribes to state changes in each slice and notifies listeners on updates.
   * - Calls the `onInit` method of each slice to perform any necessary setup.
   * - Ensures that each slice properly calls its base `onInit` method; throws an error if not.
   *
   * @throws {Error} If a slice does not call `super.onInit()` during its initialization.
   */
  init(): void {
    setupDevTools(
      this,
      this.configs.devTools as Configs<TSliceFactories>["devTools"],
    );

    Object.keys(this.slices).forEach((key) => {
      const slice = this.slices[key];

      const handleSubscribe = () => {
        const subscriptionIndex = ++this.subscriptionIndex;

        this.listeners.forEach((listener) => {
          if (subscriptionIndex !== this.subscriptionIndex) return;
          listener(this.state);
        });
      };

      slice.subscribe(handleSubscribe);
    });

    Object.keys(this.slices).forEach((key) => {
      const slice = this.slices[key];

      slice["onInit"](slice["regenerateSignal"]());

      if (!slice["initialized"])
        throw new Error(`'${slice.constructor.name}' must call super.onInit()`);
    });
  }

  /**
   * Destroys the store by invoking the `onDestroy` method on each slice and clearing all listeners.
   *
   * @remarks
   * - Calls the `onDestroy` method of each slice to perform necessary cleanup.
   * - Ensures that each slice properly calls its base `onDestroy` method; throws an error if not.
   * - Removes all registered listeners from the store.
   *
   * @throws {Error} If a slice does not call `super.onDestroy()` during its destruction.
   */
  destroy(): void {
    Object.keys(this.slices).forEach((key) => {
      const slice = this.slices[key];

      slice["onDestroy"](slice["regenerateSignal"]());

      if (slice["initialized"])
        throw new Error(
          `'${slice.constructor.name}' must call super.onDestroy()`,
        );
    });

    this.listeners.splice(0, this.listeners.length);
  }

  /**
   * Gets the current state of the store, with each slice wrapped in a proxy for enhanced state handling.
   *
   * @remarks
   * - The returned state object reflects the latest state of all slices managed by the store.
   * - Each slice is proxied to enable middleware and advanced state management features.
   * - Accessing this property does not trigger any side effects.
   */
  get state(): StateOf<TSliceFactories> {
    return this.innerState;
  }

  /**
   * Subscribes a listener function to state changes in the store.
   *
   * @param listener - A function that will be called with the current state whenever any slice of the store updates.
   * @returns An `Unsubscribe` function that, when called, removes the listener from the store.
   *
   * @remarks
   * - The listener is invoked after any state change in any slice managed by the store.
   * - Multiple listeners can be registered; all will be notified on state updates.
   * - To stop receiving updates, call the returned unsubscribe function.
   */
  subscribe(listener: Listener<TSliceFactories>): Unsubscribe {
    this.listeners.push(listener);
    return () => this.listeners.splice(this.listeners.indexOf(listener), 1);
  }
}

class SliceProxyHandler<
  TSlice extends GlobalSlice<any, any>,
  TSliceFactories extends BaseSliceFactories,
> implements ProxyHandler<TSlice>
{
  private readonly methods: Record<string, any>;
  private readonly state: SlicesOf<TSliceFactories>;
  private readonly middleware: Middleware<TSliceFactories>;

  constructor(
    state: SlicesOf<TSliceFactories>,
    middleware: Middleware<TSliceFactories>,
  ) {
    this.methods = {};
    this.state = state;
    this.middleware = middleware;
  }

  get(target: any, property: string): any {
    if (!!this.methods[property]) return this.methods[property];

    const value = target[property];
    if (typeof value !== "function") return value;

    const boundValue = value.bind(target);
    const method = (...args: any) => {
      const signal = (target as TSlice)["regenerateSignal"]();
      return this.middleware(
        () => boundValue(...args, signal),
        this.state,
        signal,
      );
    };

    this.methods[property] = method;
    return method;
  }
}
