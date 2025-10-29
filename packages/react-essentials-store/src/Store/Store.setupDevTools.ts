import type {} from "@redux-devtools/extension";

import { equals, errors, isSSR } from "@agusmgarcia/react-essentials-utils";

import { ServerSlice } from "../ServerSlice";
import type Store from "./Store";
import {
  type BaseSliceFactories,
  type Configs,
  type ReduxStateOf,
  type StateOf,
} from "./Store.types";

export default function setupDevTools<
  TSliceFactories extends BaseSliceFactories,
>(
  store: Store<TSliceFactories>,
  devTools: Configs<TSliceFactories>["devTools"],
): void {
  if (isSSR()) return;
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;
  if (
    typeof devTools === "undefined"
      ? process.env.NODE_ENV !== "development"
      : !devTools
  )
    return;

  const name =
    typeof devTools === "string"
      ? devTools
      : typeof devTools === "undefined" || typeof devTools === "boolean"
        ? "Store"
        : devTools.name || "Store";

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
      name,
    }));

  let prevState = extractState(store.state);

  if (!initialized) connection.init(prevState);
  else connection.send({ type: "STATE_RESET" }, prevState);

  const areEquals =
    typeof devTools === "object"
      ? devTools.equality || equals.deep
      : equals.deep;

  store.subscribe((state) => {
    const newState = extractState(state);
    if (areEquals(newState, prevState)) return;

    prevState = newState;
    connection.send({ type: "STATE_UPDATED" }, newState);
  });
}

function extractState<TSliceFactories extends BaseSliceFactories>(
  state: StateOf<TSliceFactories>,
): ReduxStateOf<TSliceFactories> {
  return Object.keys(state).reduce((result, key) => {
    const slice = state[key as keyof typeof state];
    result[key as keyof ReduxStateOf<TSliceFactories>] =
      slice instanceof ServerSlice
        ? { ...slice.state, error: errors.getMessage(slice.state.error) }
        : slice.state;
    return result;
  }, {} as ReduxStateOf<TSliceFactories>);
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_CONNECTIONS__?: Record<
      string,
      ReturnType<NonNullable<Window["__REDUX_DEVTOOLS_EXTENSION__"]>["connect"]>
    >;
  }
}
