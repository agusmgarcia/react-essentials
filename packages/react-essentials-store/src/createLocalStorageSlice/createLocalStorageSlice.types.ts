import {
  type AddArgumentToObject,
  type Func,
} from "@agusmgarcia/react-essentials-utils";

import { type CreateServerSliceTypes } from "#src/createServerSlice";

/**
 * Represents a slice of state with a specific name, data, selected properties and extra methods.
 *
 * @template TName - The name of the slice.
 * @template TData - The type of the data managed by the slice.
 * @template TExtraMethods - The type of additional methods provided by the slice.
 */
export type SliceOf<
  TName extends string,
  TData,
  TExtraMethods extends Record<string, Func<any, [...any[]]>> = {},
> = CreateServerSliceTypes.SliceOf<
  TName,
  TData,
  Record<string, never>,
  TExtraMethods
>;

/**
 * Extracts the name of a given slice.
 *
 * @template TSlice - The slice type to extract the name from.
 */
export type ExtractNameOf<TSlice extends SliceOf<any, any, any>> =
  CreateServerSliceTypes.ExtractNameOf<TSlice>;

/**
 * Extracts the data type of a given slice.
 *
 * @template TSlice - The slice type to extract the data from.
 */
export type ExtractDataOf<TSlice extends SliceOf<any, any, any>> =
  CreateServerSliceTypes.ExtractDataOf<TSlice>;

/**
 * Extracts the extra methods type of a given slice.
 *
 * @template TSlice - The slice type to extract the extra methods from.
 */
export type ExtractExtraMethodsOf<TSlice extends SliceOf<any, any, any>> =
  CreateServerSliceTypes.ExtractExtraMethodsOf<TSlice>;

/**
 * Represents the context provided to a slice, including methods for getting and setting state,
 * and an abort signal for managing subscriptions.
 *
 * @template TSlice - The slice type for which the context is provided.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 */
export type Context<
  TSlice extends SliceOf<any, any, any>,
  TOtherSlices = {},
> = Omit<CreateServerSliceTypes.Context<TSlice, TOtherSlices>, "regenerate"> & {
  /**
   * A function to regenerate the context.
   */
  regenerate: Func<Context<TSlice, TOtherSlices>>;
};

/**
 * Represents a subscription function for a slice, allowing listeners to be notified of state changes.
 *
 * @template TSlice - The slice type for which the subscription is created.
 * @template TOtherSlices - The other slices that may be combined with the current slice.
 * @template TContext - The context type that provides access to the slice's state and utilities.
 *
 * @param listener - A function to be called when the state changes, receiving the current context.
 * @param selector - An optional function to select a specific part of the state.
 *
 * @returns A function to unsubscribe the listener.
 */
export type Subscribe<
  TSlice extends SliceOf<any, any, any>,
  TOtherSlices,
  TContext,
> = CreateServerSliceTypes.Subscribe<TSlice, TOtherSlices, TContext>;

/**
 * A function type for creating additional methods for a slice, with access to the slice's context.
 *
 * @template TFactoryOutput - The type of the output produced by the factory function.
 * @template TContext - The context type that provides access to the slice's state and utilities.
 * @template TSubscribe - The type of the subscription function for the slice.
 *
 * @param subscribe - A function to subscribe to changes in the slice's context.
 * @returns An object containing the extra methods for the slice, with the slice's context added as an argument.
 */
export type Factory<TSlice extends SliceOf<any, any, any>, TOtherSlices> = Func<
  AddArgumentToObject<
    ExtractExtraMethodsOf<TSlice>,
    Context<TSlice, TOtherSlices>,
    "strict"
  >,
  [subscribe: Subscribe<TSlice, TOtherSlices, Context<TSlice, TOtherSlices>>]
>;

/**
 * Represents the input parameters required to create a slice.
 *
 * @template TSlice - The slice type being created.
 * @template TOtherSlices - Additional slices that may be referenced in the input.
 *
 * @param name - The name of the slice.
 * @param factory - An optional function to create extra methods for the slice.
 */
export type Input<TSlice extends SliceOf<any, any, any>, TOtherSlices> =
  ExtractExtraMethodsOf<TSlice> extends Record<string, never>
    ? [name: ExtractNameOf<TSlice>, factory?: undefined]
    : [name: ExtractNameOf<TSlice>, factory: Factory<TSlice, TOtherSlices>];

/**
 * Represents the output of a slice, including its state and additional properties.
 *
 * @template TSlice - The slice type being output.
 * @template TOtherSlices - Additional slices that may be included in the output.
 */
export type Output<
  TSlice extends SliceOf<any, any, any>,
  TOtherSlices,
> = CreateServerSliceTypes.Output<TSlice, TOtherSlices>;
