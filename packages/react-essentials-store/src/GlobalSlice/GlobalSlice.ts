import { emptyFunction, equals } from "@agusmgarcia/react-essentials-utils";

import {
  type BaseSlices,
  type BaseState,
  type Subscription,
  type Unsubscribe,
} from "./GlobalSlice.types";

/**
 * Abstract base class for managing global state slices with subscription capabilities.
 *
 * @template TState - The type representing the state managed by this slice.
 * @template TSlices - The type representing additional slices that can be injected (default: {}).
 *
 * This class provides:
 * - State management with controlled access and updates.
 * - Subscription mechanism for listening to state or selection changes.
 * - Initialization and destruction lifecycle hooks.
 * - Support for custom selectors and equality checks in subscriptions.
 *
 * To use, extend this class and implement your own state logic.
 */
export default abstract class GlobalSlice<
  TState extends BaseState,
  TSlices extends BaseSlices = {},
> {
  static readonly SELECTOR_SKIPPED_ERROR = new Error("Selector skipped");

  private readonly _subscriptions: Subscription<TState, any>[];

  private _controller: AbortController;
  private _subscriptionIndex: number;
  private _initialized: boolean;
  private _slices: TSlices | undefined;
  private _state: TState;

  /**
   * Creates a new instance of the GlobalSlice abstract class.
   *
   * @param initialState - The initial state for the slice.
   *
   * @remarks
   * This constructor initializes the internal state, subscriptions, and other
   * internal properties required for managing global state slices. It is intended
   * to be called by subclasses that extend `GlobalSlice`.
   */
  protected constructor(initialState: TState) {
    this._subscriptions = [];

    this._controller = new AbortController();
    this._subscriptionIndex = Number.MIN_SAFE_INTEGER;
    this._initialized = false;
    this._slices = undefined;
    this._state = initialState;
  }

  /**
   * Gets the collection of slices associated with this global slice.
   *
   * @throws {Error} Throws an error if the slices have not been initialized yet.
   * @returns {TSlices} The initialized slices object.
   *
   * @remarks
   * This property provides access to the internal slices managed by this global slice.
   * It is intended for use by subclasses or internal logic that requires access to
   * the composed slices. Attempting to access this property before initialization
   * will result in an error.
   */
  protected get slices(): TSlices {
    if (!this._slices)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    return this._slices;
  }

  private set slices(slices: TSlices) {
    if (!!this._slices)
      throw new Error(`'${this.constructor.name}' has been already set`);

    this._slices = new Proxy(slices, new AddProxyHandler(this));
  }

  /**
   * Gets the current state of the global slice.
   *
   * @remarks
   * This getter provides access to the internal state managed by the global slice instance.
   * It returns the current value of the state, which is of type `TState`.
   *
   * @returns {TState} The current state of the global slice.
   */
  get state(): TState {
    return this._state;
  }

  /**
   * Updates the internal state of the global slice and notifies all relevant subscribers.
   *
   * @protected
   * @param state - The new state to set for the global slice.
   *
   * @remarks
   * When the state is updated, this setter compares the previous and new state for each subscription
   * using the provided selector and equality function. If the selection has changed according to the
   * equality function, the corresponding listener is invoked with the new and previous selection.
   *
   * The setter also increments an internal subscription index to ensure that notifications are only
   * sent for the most recent state update, preventing race conditions from multiple rapid updates.
   */
  protected set state(state: TState) {
    const prevState = this._state;
    this._state = state;

    const subscriptionIndex = ++this._subscriptionIndex;

    this._subscriptions.forEach((subscription) => {
      if (subscriptionIndex !== this._subscriptionIndex) return;

      let prevSelection;
      let newSelection;

      try {
        prevSelection = subscription.selector(prevState);
        newSelection = subscription.selector(this.state);
      } catch (error) {
        if (error === GlobalSlice.SELECTOR_SKIPPED_ERROR) return;
        throw error;
      }

      if (!subscription.equality(newSelection, prevSelection))
        subscription.listener(
          newSelection,
          prevSelection,
          this === subscription.slice
            ? this._controller.signal
            : subscription.slice._regenerateSignal(),
        );
    });
  }

  /**
   * Lifecycle hook invoked during the initialization phase of the global slice.
   *
   * @protected
   * @remarks
   * This method is intended to be called when the global slice is being initialized.
   * It ensures that the slice is only initialized once by checking the internal `_initialized` flag.
   * If the slice has already been initialized, an error is thrown to prevent duplicate initialization.
   * Subclasses may override this method to perform additional setup logic during initialization,
   * but should call `super.onInit()` to preserve the base class behavior.
   *
   * @throws {Error} Throws an error if the slice has already been initialized.
   */
  protected onInit(): void {
    if (this._initialized)
      throw new Error(`'${this.constructor.name}' has been initialized`);

    this._initialized = true;
  }

  /**
   * Lifecycle hook invoked during the destruction phase of the global slice.
   *
   * @protected
   * @remarks
   * This method is intended to be called when the global slice is being destroyed or cleaned up.
   * It clears all active subscriptions and marks the slice as uninitialized.
   * If the slice has not been initialized prior to destruction, an error is thrown.
   * Subclasses may override this method to perform additional teardown logic during destruction,
   * but should call `super.onDestroy()` to preserve the base class behavior.
   *
   * @throws {Error} Throws an error if the slice has not been initialized.
   */
  protected onDestroy() {
    this._subscriptions.splice(0, this._subscriptions.length);

    if (!this._initialized)
      throw new Error(`'${this.constructor.name}' hasn't been initialized`);

    this._initialized = false;
  }

  /**
   * Subscribes to state changes of the global slice.
   *
   * @param listener - A listener function to be called when the selected part of the state changes.
   * @returns An `Unsubscribe` function that removes the subscription when called.
   */
  subscribe(listener: Subscription<TState>["listener"]): Unsubscribe;

  /**
   * Subscribes to state changes of the global slice.
   *
   * @param selector - A selector function to select a part of the state. If the {@link GlobalSlice.SELECTOR_SKIPPED_ERROR} error is thrown, the evaluation is skipped.
   * @param listener - (Optional) A listener function to be called when the selected part of the state changes.
   * @param equality - (Optional) A function to compare the previous and new selection. Defaults to strict equality.
   * @returns An `Unsubscribe` function that removes the subscription when called.
   *
   * @typeParam TSelection - The type of the selected state, inferred from the selector.
   */
  subscribe<TSelection>(
    selector: Subscription<TState, TSelection>["selector"],
    listener: Subscription<TState, TSelection>["listener"],
    equality?: Subscription<TState, TSelection>["equality"],
  ): Unsubscribe;

  subscribe(...rest: any[]): Unsubscribe {
    const subscription = extractSubscriptionParameters<TState>(this, ...rest);
    this._subscriptions.push(subscription);

    return () =>
      this._subscriptions.splice(this._subscriptions.indexOf(subscription), 1);
  }

  private _regenerateSignal(): AbortSignal {
    this._controller.abort("New signal created");
    this._controller = new AbortController();
    return this._controller.signal;
  }
}

function extractSubscriptionParameters<TState extends BaseState>(
  defaultSlice: GlobalSlice<TState, any>,
  ...rest: any[]
): Subscription<TState, TState> {
  if (!rest.length)
    return {
      equality: equals.strict,
      listener: emptyFunction,
      selector: (state) => state,
      slice: defaultSlice,
    };

  if (rest.length === 1 && rest[0] instanceof GlobalSlice)
    return {
      equality: equals.strict,
      listener: emptyFunction,
      selector: (state) => state,
      slice: rest[0],
    };

  if (rest.length === 1 && !(rest[0] instanceof GlobalSlice))
    return {
      equality: equals.strict,
      listener: rest[0],
      selector: (state) => state,
      slice: defaultSlice,
    };

  if (rest.length === 2 && rest[1] instanceof GlobalSlice)
    return {
      equality: equals.strict,
      listener: rest[0],
      selector: (state) => state,
      slice: rest[1],
    };

  if (rest.length === 2 && !(rest[1] instanceof GlobalSlice))
    return {
      equality: equals.strict,
      listener: rest[1],
      selector: rest[0],
      slice: defaultSlice,
    };

  if (rest.length === 3 && rest[2] instanceof GlobalSlice)
    return {
      equality: equals.strict,
      listener: rest[1],
      selector: rest[0],
      slice: rest[2],
    };

  if (rest.length === 3 && !(rest[2] instanceof GlobalSlice))
    return {
      equality: rest[2],
      listener: rest[1],
      selector: rest[0],
      slice: defaultSlice,
    };

  return {
    equality: rest[2],
    listener: rest[1],
    selector: rest[0],
    slice: rest[3],
  };
}

class AddProxyHandler<TState extends BaseState, TSlices extends BaseSlices>
  implements ProxyHandler<TSlices>
{
  private readonly slices: Record<string, GlobalSlice<any, any>>;
  private readonly slice: GlobalSlice<TState, TSlices>;

  constructor(slice: GlobalSlice<TState, TSlices>) {
    this.slices = {};
    this.slice = slice;
  }

  get(target: any, property: string) {
    if (!!this.slices[property]) return this.slices[property];

    const maybeSlice = target[property];
    if (!(maybeSlice instanceof GlobalSlice)) return maybeSlice;

    const slice = new Proxy(
      maybeSlice,
      new AddSliceIntoSubscribeProxyHandler(this.slice),
    );

    this.slices[property] = slice;
    return slice;
  }
}

class AddSliceIntoSubscribeProxyHandler<
  TState extends BaseState,
  TSlices extends BaseSlices,
> implements ProxyHandler<GlobalSlice<any, any>>
{
  private readonly methods: Record<string, (...args: any) => any>;
  private readonly slice: GlobalSlice<TState, TSlices>;

  constructor(slice: GlobalSlice<TState, TSlices>) {
    this.methods = {};
    this.slice = slice;
  }

  get(target: any, property: string): any {
    if (!!this.methods[property]) return this.methods[property];

    const value = target[property];
    if (typeof value !== "function") return value;

    const boundValue = value.bind(target);

    const method = (...args: any) =>
      property === "subscribe"
        ? boundValue(...args, this.slice)
        : boundValue(...args);

    this.methods[property] = method;
    return method;
  }
}
