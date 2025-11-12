import {
  emptyFunction,
  equals,
  type Func,
} from "@agusmgarcia/react-essentials-utils";

import {
  type BaseSlices,
  type BaseState,
  type IntervalCallback,
  type Subscription,
  type TimeoutCallback,
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
  /**
   * It is a known error to throw when the subscription evaluation wants to be skipped.
   */
  static readonly SELECTOR_SKIPPED_ERROR = new Error("Selector skipped");

  private readonly _subscriptions: Subscription<TState, any>[];
  private readonly _intervals: Func[];

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
    this._intervals = [];

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
      throw new Error(
        `'${this.constructor.name}' has been already set its slices`,
      );

    this._slices = new Proxy(slices, new SlicesProxyHandler(this));
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
   * @param signal - An AbortSignal that can be used to handle cancellation.
   *
   * @remarks
   * This method is intended to be called when the global slice is being initialized.
   * If the slice has already been initialized, an error is thrown to prevent duplicate initialization.
   * Subclasses may override this method to perform additional setup logic during initialization,
   * but should call `super.onInit()` to preserve the base class behavior.
   *
   * @throws {Error} Throws an error if the slice has already been initialized.
   */
  protected onInit(signal: AbortSignal): void {
    if (signal !== this._controller.signal)
      throw new Error(
        `'${this.constructor.name}'.onInit: You must pass the signal from the parent method`,
      );

    if (this._initialized)
      throw new Error(
        `'${this.constructor.name}' has been already initialized`,
      );

    this._initialized = true;
  }

  /**
   * Lifecycle hook invoked during the destruction phase of the global slice.
   *
   * @param signal - An AbortSignal that can be used to handle cancellation.
   *
   * @remarks
   * This method is intended to be called when the global slice is being destroyed or cleaned up.
   * It clears all active subscriptions and marks the slice as uninitialized.
   * If the slice has not been initialized prior to destruction, an error is thrown.
   * Subclasses may override this method to perform additional teardown logic during destruction,
   * but should call `super.onDestroy()` to preserve the base class behavior.
   *
   * @throws {Error} Throws an error if the slice has not been initialized.
   */
  protected onDestroy(signal: AbortSignal): void {
    this._subscriptions.splice(0, this._subscriptions.length);

    this._intervals.forEach((unsubscribe) => unsubscribe());
    this._intervals.splice(0, this._intervals.length);

    if (!this._initialized)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    this._initialized = false;

    if (signal !== this._controller.signal)
      throw new Error(
        `'${this.constructor.name}'.onDestroy: You must pass the signal from the parent method`,
      );
  }

  /**
   * Sets up a one-time timeout to execute a callback function.
   *
   * @param callback - The function to be executed after the timeout.
   * @param duration - The duration in milliseconds to wait before executing the callback.
   * @param signal - An AbortSignal to manage cancellation of the timeout.
   * @returns An `Unsubscribe` function that stops the timeout when called.
   */
  protected setTimeout(
    callback: TimeoutCallback,
    duration: number,
    signal: AbortSignal,
  ): Func {
    if (signal !== this._controller.signal)
      throw new Error(
        `'${this.constructor.name}'.setTimeout: You must pass the signal from the parent method`,
      );

    return this._setInterval(callback, true, duration);
  }

  /**
   * Sets up a recurring interval to execute a callback function.
   *
   * @param callback - The function to be executed at each interval.
   * @param duration - The duration in milliseconds between each execution of the callback.
   * @param signal - An AbortSignal to manage cancellation of the interval.
   * @returns An `Unsubscribe` function that stops the interval when called.
   */
  protected setInterval(
    callback: IntervalCallback,
    duration: number,
    signal: AbortSignal,
  ): Func {
    if (signal !== this._controller.signal)
      throw new Error(
        `'${this.constructor.name}'.setInterval: You must pass the signal from the parent method`,
      );

    return this._setInterval(callback, false, duration);
  }

  private _setInterval(
    callback: IntervalCallback,
    once: boolean,
    duration: number,
  ): Func {
    const controller = new AbortController();

    const cb = async () => {
      const start = Date.now();

      const signal = AbortSignal.any([
        controller.signal,
        this._regenerateSignal(),
      ]);

      try {
        await callback(signal);
      } catch (error) {
        if (!signal.aborted) throw error;
      }

      if (once) return;
      if (controller.signal.aborted) return;

      const elapsed = Date.now() - start;
      handler = setTimeout(cb, Math.max(duration - elapsed, 0));
    };

    let handler = setTimeout(cb, duration);

    const unsubscribe = () => {
      clearTimeout(handler);
      this._intervals.splice(this._intervals.indexOf(unsubscribe), 1);
      controller.abort();
    };

    this._intervals.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Subscribes to state changes of the global slice.
   *
   * @param listener - A listener function to be called when the selected part of the state changes.
   * @returns An `Unsubscribe` function that removes the subscription when called.
   */
  subscribe(listener: Subscription<TState>["listener"]): Func;

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
  ): Func;

  subscribe(...rest: any[]): Func {
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

class SlicesProxyHandler<TState extends BaseState, TSlices extends BaseSlices>
  implements ProxyHandler<TSlices>
{
  private readonly slices: Record<string, GlobalSlice<any, any>>;
  private readonly slice: GlobalSlice<TState, TSlices>;

  constructor(slice: GlobalSlice<TState, TSlices>) {
    this.slices = {};
    this.slice = slice;
  }

  get(target: TSlices, property: string) {
    if (!!this.slices[property]) return this.slices[property];

    const maybeSlice = target[property];
    if (!(maybeSlice instanceof GlobalSlice)) return maybeSlice;

    const slice = new Proxy(maybeSlice, new SliceProxyHandler(this.slice));

    this.slices[property] = slice;
    return slice;
  }
}

class SliceProxyHandler<TState extends BaseState, TSlices extends BaseSlices>
  implements ProxyHandler<GlobalSlice<any, any>>
{
  private readonly methods: Record<string, (...args: any) => any>;
  private readonly slice: GlobalSlice<TState, TSlices>;

  constructor(slice: GlobalSlice<TState, TSlices>) {
    this.methods = {};
    this.slice = slice;
  }

  get(
    target: GlobalSlice<any, any>,
    property: keyof GlobalSlice<any, any>,
  ): any {
    if (!!this.methods[property]) return this.methods[property];

    const value = target[property];
    if (typeof value !== "function") return value;

    const boundValue = value.bind(target);
    const method = (...args: any[]) => {
      if (property === "subscribe") return boundValue(...args, this.slice);

      const signalFromTargetSlice = target["_regenerateSignal"]();
      const signalFromCurrentSlice: unknown = args.at(-1);

      if (!(signalFromCurrentSlice instanceof AbortSignal))
        return boundValue(...args);

      return boundValue(
        ...[
          ...args.slice(0, -1),
          AbortSignal.any([signalFromCurrentSlice, signalFromTargetSlice]),
        ],
      );
    };

    this.methods[property] = method;
    return method;
  }
}
