import { type Func } from "@agusmgarcia/react-essentials-utils";

import { type GlobalSliceTypes } from "../GlobalSlice";

/**
 * Represents the base state type for the global slice.
 * This type should be serializable to ensure state can be persisted or transferred.
 */
export type BaseResponse = GlobalSliceTypes.BaseState;

/**
 * Represents a mapping of slice names to their corresponding GlobalSlice instances.
 * Each key is a string identifier for the slice, and the value is a GlobalSlice
 * instance parameterized with any state and action types.
 */
export type BaseSlices = GlobalSliceTypes.BaseSlices;

/**
 * Configuration options for the ServerSlice.
 */
export type Configs = {
  /**
   * A function that determines whether a given error should be excluded from processing.
   *
   * @param error - The error object to evaluate.
   * @returns A boolean indicating whether the error should be excluded (`true`) or not (`false`).
   */
  excludeError: Func<boolean, [error: unknown]>;
};
