import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createContext as createContextSelector,
  useContextSelector,
} from "use-context-selector";

import { Store, type StoreTypes } from "../Store";
import {
  type BaseSliceFactories,
  type Input,
  type Output,
} from "./createReactStore.types";

const StoreContext = createContext<Store<any> | null>(null);
StoreContext.displayName = "StoreContext";

const StateContext = createContextSelector(Number.MIN_SAFE_INTEGER);
StateContext.displayName = "StateContext";

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

      return (
        <StoreContext.Provider value={storeRef.current}>
          <StateContext.Provider value={state}>
            {props.children}
          </StateContext.Provider>
        </StoreContext.Provider>
      );
    },
    useSelector: (selector) => {
      const store = useContext(StoreContext);
      if (!store)
        throw new Error(
          "You should wrap your component within <StoreProvider>",
        );

      return useContextSelector(StateContext, () =>
        selector(store.state as any),
      );
    },
  };
}

function countCyclicly(number: number): number {
  if (number === Number.MAX_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER;
  return number + 1;
}
