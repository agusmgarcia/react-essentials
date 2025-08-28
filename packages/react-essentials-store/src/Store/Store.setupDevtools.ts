import type {} from "@redux-devtools/extension";

import { errors, isSSR } from "@agusmgarcia/react-essentials-utils";

import ServerSlice from "../ServerSlice";
import type Store from "./Store";
import { type BaseSliceFactories, type StateOf } from "./Store.types";

export default function setupDevTools<
  TSliceFactories extends BaseSliceFactories,
>(store: Store<TSliceFactories>, devTools: boolean | string | undefined): void {
  if (isSSR()) return;
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;
  if (
    typeof devTools === "undefined"
      ? process.env.NODE_ENV !== "development"
      : !devTools
  )
    return;

  const name = typeof devTools === "string" ? devTools : "Store";

  window.__REDUX_DEVTOOLS_CONNECTIONS__ ||= {};
  const initialized = !!window.__REDUX_DEVTOOLS_CONNECTIONS__[name];

  const connection = (window.__REDUX_DEVTOOLS_CONNECTIONS__[name] ||=
    window.__REDUX_DEVTOOLS_EXTENSION__.connect({
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
    }));

  if (!initialized) connection.init(extractState(store.state));
  else connection.send({ type: "STATE_RESET" }, extractState(store.state));

  store.subscribe((state) => {
    const newState = extractState(state);
    connection.send({ type: "STATE_UPDATED" }, newState);
  });
}

function extractState<TSliceFactories extends BaseSliceFactories>(
  state: StateOf<TSliceFactories>,
): Record<string, any> {
  return Object.keys(state).reduce(
    (result, key) => {
      const slice = state[key as keyof typeof state];
      result[key] =
        slice instanceof ServerSlice
          ? { ...slice.state, error: errors.getMessage(slice.state.error) }
          : slice.state;
      return result;
    },
    {} as Record<string, any>,
  );
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_CONNECTIONS__?: Record<
      string,
      ReturnType<NonNullable<Window["__REDUX_DEVTOOLS_EXTENSION__"]>["connect"]>
    >;
  }
}
