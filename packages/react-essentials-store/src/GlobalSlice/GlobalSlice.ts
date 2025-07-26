import { type Const, equals } from "@agusmgarcia/react-essentials-utils";

import {
  type BaseSlices,
  type BaseState,
  type Subscription,
  type Unsubscribe,
} from "./GlobalSlice.types";

export default abstract class GlobalSlice<
  TState extends BaseState,
  TSlices extends BaseSlices = {},
> {
  private readonly _subscriptions: Const<Subscription<TState, any>, "strict">[];

  private _subscriptionIndex: number;
  private _initialized: boolean;
  private _slices: Const<TSlices, "shallow"> | undefined;
  private _state: Const<TState>;

  protected constructor(initialState: Const<TState>) {
    this._subscriptions = [];

    this._subscriptionIndex = Number.MIN_SAFE_INTEGER;
    this._initialized = false;
    this._slices = undefined;
    this._state = initialState;
  }

  protected get slices(): Const<TSlices, "shallow"> {
    if (!this._slices)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    return this._slices;
  }

  private set slices(slices: Const<TSlices, "shallow">) {
    if (!!this._slices)
      throw new Error(`'${this.constructor.name}' has been already set`);

    this._slices = slices;
  }

  get state(): Const<TState> {
    return this._state;
  }

  protected set state(state: Const<TState>) {
    const prevState = this._state;
    this._state = state;

    const subscriptionIndex = ++this._subscriptionIndex;

    this._subscriptions.forEach((subscription) => {
      if (subscriptionIndex !== this._subscriptionIndex) return;

      const prevSelection = subscription.selector(prevState);
      const newSelection = subscription.selector(this.state);

      if (!subscription.equality(newSelection, prevSelection))
        subscription.listener(newSelection, prevSelection);
    });
  }

  protected onInit(): void {
    if (this._initialized)
      throw new Error(`'${this.constructor.name}' has been initialized`);

    this._initialized = true;
  }

  protected onDestroy() {
    if (!this._initialized)
      throw new Error(`'${this.constructor.name}' hasn't been initialized`);

    this._initialized = false;
  }

  subscribe(listener: Subscription<TState>["listener"]): Unsubscribe;

  subscribe<TSelection>(
    selector: Subscription<TState, TSelection>["selector"],
    listener: Subscription<TState, TSelection>["listener"],
    equality?: Subscription<TState, TSelection>["equality"],
  ): Unsubscribe;

  subscribe<TSelection>(
    listenerOrSelector:
      | Subscription<TState>["listener"]
      | Subscription<TState, TSelection>["selector"],
    listener?: Subscription<TState, TSelection>["listener"],
    equality?: Subscription<TState, TSelection>["equality"],
  ): Unsubscribe {
    const subscription: Subscription<TState, TSelection> = {
      equality: equality || equals.strict,
      listener:
        listener ||
        (listenerOrSelector as Subscription<TState, TSelection>["listener"]),
      selector:
        arguments.length > 1
          ? (listenerOrSelector as Subscription<TState, TSelection>["selector"])
          : (state) => state as TSelection,
    };

    this._subscriptions.push(subscription);

    return () =>
      this._subscriptions.splice(this._subscriptions.indexOf(subscription), 1);
  }
}
