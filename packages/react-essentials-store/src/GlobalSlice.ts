import { equals, type Func } from "@agusmgarcia/react-essentials-utils";

import { type Const, type DeepPrimitive, sealed } from "#src/utils";

export default abstract class GlobalSlice<
  TState extends DeepPrimitive,
  TSlices extends Record<string, GlobalSlice<any, any>> = {},
> {
  private readonly _subscriptions: Readonly<Subscription>[];

  private _controller: AbortController;
  private _initialized: boolean;
  private _slices: TSlices | undefined;
  private _state: Const<TState>;

  protected constructor(initialState: Const<TState>) {
    this._subscriptions = [];

    this._controller = new AbortController();
    this._initialized = false;
    this._slices = undefined;
    this._state = initialState;
  }

  @sealed
  protected get slices(): TSlices {
    if (!this._slices)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    return this._slices;
  }

  @sealed
  private set slices(slices: TSlices) {
    if (!!this._slices)
      throw new Error(`'${this.constructor.name}' has been initialized`);

    this._slices = slices;
    this.init();

    if (!this._initialized)
      throw new Error(`'${this.constructor.name}' hasn't called super.init()`);
  }

  @sealed
  protected get signal(): AbortSignal {
    return this._controller.signal;
  }

  @sealed
  get state(): Const<TState> {
    return this._state;
  }

  @sealed
  protected set state(state: Const<TState>) {
    this._controller.abort("Aborted");
    this._controller = new AbortController();

    const prevState = this._state;
    this._state = state;

    this._subscriptions.forEach((subscription) => {
      const prevSelection = subscription.selector(prevState);
      const newSelection = subscription.selector(this.state);

      if (!subscription.equality(newSelection, prevSelection))
        subscription.listener(newSelection, prevSelection);
    });
  }

  protected init(): void {
    this._initialized = true;
  }

  subscribe(
    listener: Func<
      void,
      [newSelection: Const<TState>, prevSelection: Const<TState>]
    >,
  ): Func;

  subscribe<TSelection extends DeepPrimitive>(
    listener: Func<
      void,
      [newSelection: Const<TSelection>, prevSelection: Const<TSelection>]
    >,
    selector: Func<Const<TSelection>, [state: Const<TState>]>,
    equality?: Func<
      boolean,
      [newSelection: Const<TSelection>, prevSelection: Const<TSelection>]
    >,
  ): Func;

  @sealed
  subscribe(
    listener: Func<void, [newSelection: any, prevSelection: any]>,
    selector?: Func<any, [state: Const<TState>]>,
    equality?: Func<boolean, [newSelection: any, prevSelection: any]>,
  ): Func {
    const subscription: Subscription = {
      equality: equality || equals.strict,
      listener,
      selector: selector || ((state) => state),
    };

    this._subscriptions.push(subscription);
    return () =>
      this._subscriptions.splice(this._subscriptions.indexOf(subscription), 1);
  }
}

type Subscription = {
  equality: Func<boolean, [newSelection: any, prevSelection: any]>;
  listener: Func<void, [newSelection: any, prevSelection: any]>;
  selector: Func<any, [state: any]>;
};
