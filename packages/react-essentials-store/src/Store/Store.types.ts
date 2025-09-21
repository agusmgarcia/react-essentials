import { type Func } from "@agusmgarcia/react-essentials-utils";

import type GlobalSlice from "../GlobalSlice";

/**
 * Represents a mapping of string keys to slice factory constructors.
 * Each value is a constructor function that creates an instance of a GlobalSlice.
 *
 * @typeParam string - The key representing the name of the slice.
 * @typeParam new (...args: any) => GlobalSlice<any, any> - The constructor for a GlobalSlice, accepting any arguments.
 */
export type BaseSliceFactories = Record<
  string,
  new (...args: any) => GlobalSlice<any, any>
>;

/**
 * Represents a middleware function that can intercept or modify state changes.
 *
 * @typeParam TSliceFactories - The type of the slice factories used in the store.
 * @param callback - The next function to call in the middleware chain.
 * @param state - The current state of the store, derived from the slice factories.
 * @returns Any value, depending on the middleware implementation.
 */
export type Middleware<TSliceFactories extends BaseSliceFactories> = Func<
  any,
  [callback: Func<any>, state: StateOf<TSliceFactories>]
>;

/**
 * Configuration options for the store.
 *
 * @typeParam TSliceFactories - The type of the slice factories used in the store.
 */
export type Configs<TSliceFactories extends BaseSliceFactories> = {
  /**
   * Enables Redux DevTools integration. Can be a boolean to enable/disable, or a string to specify a name.
   */
  devTools?: boolean | string;

  /**
   * A single middleware or an array of middlewares to intercept or modify state changes.
   */
  middlewares?: Middleware<TSliceFactories> | Middleware<TSliceFactories>[];
} & (ParamsOf<TSliceFactories> extends Record<string, never>
  ? {
      /**
       * Parameters for each slice factory. Required if any slice factory requires constructor parameters.
       */
      params?: undefined;
    }
  : {
      /**
       * Parameters for each slice factory. Required if any slice factory requires constructor parameters.
       */
      params: ParamsOf<TSliceFactories>;
    });

/**
 * Represents the input parameters for creating a store.
 *
 * If none of the slice factories require constructor parameters, the configs parameter is optional.
 * Otherwise, configs (with required params) must be provided.
 *
 * @typeParam TSliceFactories - The type of the slice factories used in the store.
 * @param sliceFactories - The mapping of slice names to their factory constructors.
 * @param configs - Optional configuration options for the store, including middleware, devTools, and slice parameters.
 */
export type Input<TSliceFactories extends BaseSliceFactories> =
  ParamsOf<TSliceFactories> extends Record<string, never>
    ? [sliceFactories: TSliceFactories, configs?: Configs<TSliceFactories>]
    : [sliceFactories: TSliceFactories, configs: Configs<TSliceFactories>];

/**
 * Extracts the constructor parameter types for each slice factory in the given mapping.
 *
 * For each key in the slice factories, if the corresponding constructor requires parameters,
 * the key is included in the resulting type with its value being the tuple of constructor parameters.
 * If the constructor does not require parameters (i.e., its parameter list is empty), the key is omitted.
 *
 * @typeParam TSliceFactories - The mapping of slice names to their factory constructors.
 */
export type ParamsOf<TSliceFactories extends BaseSliceFactories> = {
  [TKey in keyof TSliceFactories as ConstructorParameters<
    TSliceFactories[TKey]
  > extends never[]
    ? never
    : TKey]: ConstructorParameters<TSliceFactories[TKey]>;
};

/**
 * Maps each key of the provided slice factories to the instance type created by its constructor.
 *
 * For each key in the TSliceFactories mapping, this type produces the corresponding instance type
 * (i.e., the type returned by the constructor of the slice factory).
 *
 * @typeParam TSliceFactories - The mapping of slice names to their factory constructors.
 */
export type SlicesOf<TSliceFactories extends BaseSliceFactories> = {
  [TKey in keyof TSliceFactories]: InstanceType<TSliceFactories[TKey]>;
};

/**
 * Represents the state shape of the store, derived from the provided slice factories.
 *
 * This type maps each slice name to its corresponding instance type, omitting the "subscribe" property
 * from each slice instance. The resulting type is a plain object containing only the stateful properties of each slice.
 *
 * @typeParam TSliceFactories - The mapping of slice names to their factory constructors.
 */
export type StateOf<TSliceFactories extends BaseSliceFactories> = {
  [TKey in keyof SlicesOf<TSliceFactories>]: RemoveLastParameter<
    Omit<SlicesOf<TSliceFactories>[TKey], "subscribe">,
    AbortSignal
  >;
};

/**
 * Represents a listener function that is called with the current state of the store.
 *
 * @typeParam TSliceFactories - The type of the slice factories used in the store.
 * @param state - The current state of the store, derived from the slice factories.
 */
export type Listener<TSliceFactories extends BaseSliceFactories> = Func<
  void,
  [state: StateOf<TSliceFactories>]
>;

/**
 * Represents a function that unsubscribes a listener from the store.
 *
 * This function is typically returned when subscribing to store changes,
 * allowing the caller to remove the listener when it is no longer needed.
 */
export type Unsubscribe = Func;

type RemoveLastParameter<TData, TParameter> = {
  [TKey in keyof TData]: TData[TKey] extends (
    ...args: [...infer TArgs, TParameter]
  ) => infer TResult
    ? (...args: TArgs) => TResult
    : TData[TKey] extends (
          ...args: [...infer TArgs, infer TLastArg]
        ) => infer TResult
      ? TLastArg extends TParameter
        ? (...args: TArgs) => TResult
        : TData[TKey]
      : TData[TKey];
};
