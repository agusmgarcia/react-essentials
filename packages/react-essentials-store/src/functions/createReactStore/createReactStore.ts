import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  createContext as createContextSelector,
  useContextSelector,
} from "use-context-selector";

import { Store, type StoreTypes } from "#src/classes";

import {
  type BaseSliceFactories,
  type Input,
  type Output,
} from "./createReactStore.types";

const STORE_CONTEXT = createContext<Store<any> | null>(null);
STORE_CONTEXT.displayName = "StoreContext";

const STATE_CONTEXT = createContextSelector(Number.MIN_SAFE_INTEGER);
STATE_CONTEXT.displayName = "StateContext";

/**
 * Creates a React store provider and a selector hook for state management using context.
 *
 * @template TSliceFactories - The type of slice factories used to create the store.
 */
export default function createReactStore<
  TSliceFactories extends BaseSliceFactories,
>({
  devTools,
  middlewares,
  slices,
}: Input<TSliceFactories>): Output<TSliceFactories> {
  return {
    StoreProvider: (props) => {
      const storeRef = useRef<Store<TSliceFactories>>(null);

      if (!storeRef.current)
        storeRef.current = new Store<TSliceFactories>(
          ...([
            slices,
            { devTools, middlewares, params: props.params },
          ] as StoreTypes.Input<TSliceFactories>),
        );

      const [state, setState] = useState(Number.MIN_SAFE_INTEGER);

      useEffect(() => {
        const store = storeRef.current;
        if (!store) return;

        const unsubscribe = store.subscribe(() => setState(countCyclicly));
        return () => unsubscribe();
      }, []);

      useEffect(() => {
        const store = storeRef.current;
        if (!store) return;

        store.init();
        return () => store.destroy();
      }, []);

      return React.createElement(
        STORE_CONTEXT.Provider,
        { value: storeRef.current },
        // eslint-disable-next-line react/no-children-prop
        React.createElement(
          STATE_CONTEXT.Provider,
          { children: undefined, value: state },
          props.children,
        ),
      );
    },
    useSelector: (selector) => {
      const store = useContext(STORE_CONTEXT);
      if (!store)
        throw new Error(
          "You should wrap your component within <StoreProvider>",
        );

      return useContextSelector(STATE_CONTEXT, () =>
        selector(store.state as any),
      );
    },
  };
}

function countCyclicly(number: number): number {
  if (number === Number.MAX_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER;
  return number + 1;
}
