import { createContext, useContext, useRef } from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { devtools } from "zustand/middleware";

import { type Func } from "@agusmgarcia/react-essentials-utils";

import { type CreateGlobalSliceTypes } from "../createGlobalSlice";
import {
  type Input,
  type Middleware,
  type Output,
  type SlicesOf,
} from "./createStore.types";

const StoreContext = createContext<Store<any[]> | undefined>(undefined);
StoreContext.displayName = "StoreContext";

/**
 * Creates a store with support for multiple slice factories and provides
 * a React context for accessing the store and its selectors.
 *
 * @template TSliceFactories - An array of slice factory types extending `CreateGlobalSliceTypes.Output`.
 *
 * @param {...Input<TSliceFactories>} input - A list of slice factory inputs used to create the store.
 *
 * @returns {Output<TSliceFactories>} An object containing:
 * - `StoreProvider`: A React component that provides the store context to its children.
 * - `useSelector`: A hook to select and retrieve state from the store.
 *
 * ### Example
 * ```tsx
 * const { StoreProvider, useSelector } = createStore(sliceFactory1, sliceFactory2);
 *
 * function App() {
 *   return (
 *     <StoreProvider initialState={{ key: value }}>
 *       <ChildComponent />
 *     </StoreProvider>
 *   );
 * }
 *
 * function ChildComponent() {
 *   const selectedState = useSelector((state) => state.someKey);
 *   return <div>{selectedState}</div>;
 * }
 * ```
 *
 * ### Notes
 * - The `StoreProvider` component initializes the store and provides it via React context.
 * - The `useSelector` hook allows components to access specific parts of the store's state.
 * - The `devtools` middleware is enabled for debugging purposes.
 *
 * @throws Will throw an error if `useSelector` is used outside of a `StoreProvider`.
 */
export default function createStore<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
>(
  ...input: Input<TSliceFactories>
): Output<TSliceFactories> &
  Func<
    Output<TSliceFactories>,
    [...middlewares: Middleware<TSliceFactories>[]]
  > {
  const result: Func<
    Output<TSliceFactories>,
    [...middlewares: Middleware<TSliceFactories>[]]
  > = (...middlewares) => {
    const middleware: Middleware<TSliceFactories> = function (
      callback,
      context,
      slice,
      property,
    ) {
      let result = callback;

      for (let i = middlewares.length - 1; i >= 0; i--) {
        const middleware = middlewares[i];
        result = middleware.bind(undefined, result, context, slice, property);
      }

      return result();
    };

    return {
      StoreProvider: (props) => {
        const storeRef = useRef<Store<TSliceFactories>>(null);

        if (!storeRef.current)
          storeRef.current = create<SlicesOf<TSliceFactories>>()(
            devtools(
              (...a) =>
                input.reduce(
                  (result, factory) => ({
                    ...result,
                    ...factory(props.initialState, middleware)(...a),
                  }),
                  {},
                ),
              { enabled: true },
            ),
          );

        return (
          <StoreContext.Provider value={storeRef.current}>
            {props.children}
          </StoreContext.Provider>
        );
      },
      useSelector: (selector) => {
        const store = useContext(StoreContext);
        if (!store) throw "";

        return store(selector as any);
      },
    };
  };

  const resultProperties = result((callback) => callback());
  Object.keys(resultProperties).forEach((key) => {
    (result as any)[key] = (resultProperties as any)[key];
  });

  return result as any;
}

type Store<
  TSliceFactories extends CreateGlobalSliceTypes.Output<any, any, any>[],
> = UseBoundStore<StoreApi<SlicesOf<TSliceFactories>>>;
