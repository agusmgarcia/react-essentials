import {
  type Const,
  type Func,
  type Serializable,
} from "@agusmgarcia/react-essentials-utils";

export type BaseState = Serializable;

export type BaseSlices = Record<string, {}>;

export type Subscription<
  TState extends BaseState,
  TSelection = Const<TState>,
> = {
  equality: Func<
    boolean,
    [newSelection: TSelection, prevSelection: TSelection]
  >;
  listener: Func<void, [newSelection: TSelection, prevSelection: TSelection]>;
  selector: Func<TSelection, [state: Const<TState>]>;
};

export type Unsubscribe = Func;
