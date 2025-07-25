import { type Const, equals, isSSR } from "@agusmgarcia/react-essentials-utils";

import type GlobalSlice from "../GlobalSlice";
import type Store from "./Store";
import {
  type BaseSliceFactories,
  type Configs,
  type StateOf,
} from "./Store.types";

export default function setupDevTools<
  TSliceFactories extends BaseSliceFactories,
>(
  store: Store<TSliceFactories>,
  devTools: Const<Configs<TSliceFactories>, "shallow">["devTools"] | undefined,
): void {
  if (isSSR()) return;
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;
  if (
    typeof devTools === "undefined"
      ? process.env.NODE_ENV !== "development"
      : !devTools
  )
    return;

  const connection = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    features: {
      dispatch: false,
      export: false,
      import: false,
      jump: false,
      lock: false,
      pause: false,
      persist: false,
      reorder: false,
      skip: false,
      test: false,
    },
    name: typeof devTools === "string" ? devTools : "Store",
  });

  let lastState = extractState(store.state);
  connection.init(lastState);

  store.subscribe((state) => {
    const newState = extractState(state);

    if (equals.deep(newState, lastState)) return;
    lastState = newState;

    connection.send({ type: "STATE_UPDATED" }, newState);
  });
}

function extractState<TSliceFactories extends BaseSliceFactories>(
  state: Const<StateOf<TSliceFactories>, "shallow">,
): Record<string, any> {
  return Object.keys(state).reduce(
    (result, key) => {
      const slice = state[key as keyof typeof state];
      result[key] = (slice as unknown as GlobalSlice<any>).state;
      return result;
    },
    {} as Record<string, any>,
  );
}
