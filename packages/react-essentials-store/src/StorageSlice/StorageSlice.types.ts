import { type ServerSliceTypes } from "../ServerSlice";

/**
 * Represents the base state type for the global slice.
 * This type should be serializable to ensure state can be persisted.
 */
export type BaseData = ServerSliceTypes.BaseResponse;

/**
 * Represents a mapping of slice names to their corresponding GlobalSlice instances.
 * Each key is a string identifier for the slice, and the value is a GlobalSlice
 * instance parameterized with any state and action types.
 */
export type BaseSlices = ServerSliceTypes.BaseSlices;
