import { type Func } from "@agusmgarcia/react-essentials-utils";

import { type StoreTypes } from "../Store";

/**
 * Represents a mapping of string keys to slice factory constructors.
 * Each value is a constructor function that creates an instance of a GlobalSlice.
 *
 * @typeParam string - The key representing the name of the slice.
 * @typeParam new (...args: any) => GlobalSlice<any, any> - The constructor for a GlobalSlice, accepting any arguments.
 */
export type BaseSliceFactories = StoreTypes.BaseSliceFactories;

/**
 * The input configuration for creating a React store.
 *
 * @typeParam TSliceFactories - A mapping of slice names to their factory constructors.
 */
export type Input<TSliceFactories extends BaseSliceFactories> = {
  /**
   * Enables Redux DevTools integration. Can be a boolean to
   * enable/disable, a string to specify a name or a configuration object.
   */
  devTools?: StoreTypes.Configs<TSliceFactories>["devTools"];

  /**
   * Optional array of middleware functions to enhance the store.
   */
  middlewares?: StoreTypes.Configs<TSliceFactories>["middlewares"];

  /**
   * The mapping of slice factories used to create the store's state.
   */
  slices: TSliceFactories;
};

/**
 * The output object returned by the `createReactStore` function.
 *
 * @typeParam TSliceFactories - A mapping of slice names to their factory constructors.
 */
export type Output<TSliceFactories extends BaseSliceFactories> = {
  /**
   * A React component that provides the store context to its children.
   * Accepts props including `children` and any additional store configuration
   * except for `devTools` and `middlewares`.
   */
  StoreProvider: Func<
    React.ReactElement,
    [
      props: {
        children?: React.ReactNode;
      } & Omit<StoreTypes.Configs<TSliceFactories>, "devTools" | "middlewares">,
    ]
  >;

  /**
   * A hook to select a specific piece of state from the store.
   *
   * @param selector A function that receives the store state and returns the selected data.
   * @returns The selected data.
   */
  useSelector: <TSelectedData>(
    selector: Func<TSelectedData, [state: StoreTypes.StateOf<TSliceFactories>]>,
  ) => TSelectedData;
};
