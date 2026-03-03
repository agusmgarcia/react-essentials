import { type StoreTypes } from "#src/classes";

export default function createMiddleware<
  TSliceFactories extends StoreTypes.BaseSliceFactories,
>(
  middlewares: StoreTypes.Middleware<TSliceFactories>[],
): StoreTypes.Middleware<TSliceFactories> {
  return function (callback, state, signal) {
    let result = callback;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const middleware = middlewares[i];
      result = middleware.bind(undefined, result, state, signal);
    }

    return result();
  };
}
