import {
  type Primitive,
  type Serializable,
} from "@agusmgarcia/react-essentials-utils";

import { type StorageSliceTypes } from "#src/StorageSlice";

/**
 * Represents the base state type for the global slice.
 * This type should be serializable to ensure state can be persisted or transferred.
 */
export type BaseData = Primitive | { [key: string]: Serializable };

/**
 * Represents a mapping of slice names to their corresponding GlobalSlice instances.
 * Each key is a string identifier for the slice, and the value is a GlobalSlice
 * instance parameterized with any state and action types.
 */
export type BaseSlices = StorageSliceTypes.BaseSlices;

/**
 * Configuration options for the QueryStringStorageSlice.
 */
export type Configs = {
  /**
   * The interval (in milliseconds) at which the storage synchronization occurs.
   * It uses 1.000 ms by default.
   */
  interval: number;

  /**
   * Determines the history update strategy.
   */
  mode: "push" | "replace";
};
