import { type BaseSliceFactories, type Middleware } from "./Store.types";

export default function createMiddleware<
  TSliceFactories extends BaseSliceFactories,
>(middlewares: Middleware<TSliceFactories>[]): Middleware<TSliceFactories> {
  return function (callback, state, signal) {
    let result = callback;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      result = middleware.bind(undefined, result, state, signal);
    }

    return result();
  };
}
