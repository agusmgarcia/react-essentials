import {
  type Func,
  type Serializable,
} from "@agusmgarcia/react-essentials-utils";

import type GlobalSlice from "./GlobalSlice";

/**
 * Represents the base state type for the global slice.
 * This type should be serializable to ensure state can be persisted or transferred.
 */
export type BaseState = Serializable;

/**
 * Represents a mapping of slice names to their corresponding GlobalSlice instances.
 * Each key is a string identifier for the slice, and the value is a GlobalSlice
 * instance parameterized with any state and action types.
 */
export type BaseSlices = Record<string, GlobalSlice<any, any>>;

/**
 * Represents a subscription to a slice of state.
 *
 * @template TState - The type of the base state.
 * @template TSelection - The type of the selected state (defaults to TState).
 */
export type Subscription<TState extends BaseState, TSelection = TState> = {
  /**
   * A function that compares the new and previous selection to determine if they are equal.
   */
  equality: Func<
    boolean,
    [newSelection: TSelection, prevSelection: TSelection]
  >;

  /**
   * A function that is called when the selection changes, receiving the new and previous selection.
   */
  listener: Func<void, [newSelection: TSelection, prevSelection: TSelection]>;

  /**
   * A function that selects a portion of the state to subscribe to.
   */
  selector: Func<TSelection, [state: TState]>;
};

/**
 * Represents a function that unsubscribes from a subscription.
 * When called, it will remove the associated listener or effect.
 */
export type Unsubscribe = Func;
