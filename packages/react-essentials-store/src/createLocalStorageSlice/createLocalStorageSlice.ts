import { equals } from "@agusmgarcia/react-essentials-utils";

import createServerSlice, {
  type CreateServerSliceTypes,
} from "../createServerSlice";
import {
  type Context,
  type ExtractDataOf,
  type Input,
  type Output,
  type SliceOf,
  type Subscribe,
} from "./createLocalStorageSlice.types";

export default function createLocalStorageSlice<
  TSlice extends SliceOf<any, any, any>,
  TOtherSlices = {},
>(...input: Input<TSlice, TOtherSlices>): Output<TSlice, TOtherSlices> {
  return (initialData, middleware) => {
    const name = input[0];
    const factory = input[1];

    const result = createServerSlice<TSlice, TOtherSlices>(
      ...([
        name,
        async () =>
          deserializeItem<ExtractDataOf<TSlice>>(localStorage.getItem(name)),
        undefined,
        (
          subscribe: CreateServerSliceTypes.Subscribe<
            TSlice,
            TOtherSlices,
            CreateServerSliceTypes.Context<TSlice, TOtherSlices>
          >,
        ) => {
          subscribe((context) => {
            const handleStorage = (event: StorageEvent) => {
              if (event.storageArea !== window.localStorage) return;
              if (!!event.key && event.key !== name) return;
              context.reload();
            };

            window.addEventListener("storage", handleStorage);
          });

          subscribe(
            (context) =>
              typeof context.get()[name].data !== "undefined"
                ? localStorage.setItem(
                    name,
                    serializeData(context.get()[name].data),
                  )
                : localStorage.removeItem(name),
            (state) => state[name].data,
            equals.deep,
          );

          const localStorageSubscribe: Subscribe<
            TSlice,
            TOtherSlices,
            Context<TSlice, TOtherSlices>
          > = (listener, selector, equality) =>
            subscribe(
              (context) => listener(buildContext(context)),
              selector,
              equality,
            );

          const localStorageExtraMethods = factory?.(localStorageSubscribe);

          const extraMethods = !!localStorageExtraMethods
            ? Object.keys(localStorageExtraMethods).reduce(
                (result, key) => {
                  const element = localStorageExtraMethods[key];
                  result[key] = (...args: any[]) =>
                    element(...args.slice(0, -1), buildContext(args.at(-1)));
                  return result;
                },
                {} as Record<string, any>,
              )
            : undefined;

          return { ...extraMethods };
        },
      ] as unknown as CreateServerSliceTypes.Input<TSlice, TOtherSlices>),
    );

    return result(initialData, middleware);
  };
}

function buildContext<TSlice extends SliceOf<any, any, any>, TOtherSlices>(
  context: CreateServerSliceTypes.Context<TSlice, TOtherSlices>,
): Context<TSlice, TOtherSlices> {
  return {
    get: context.get,
    loadMore: context.loadMore,
    regenerate: () => buildContext(context.regenerate()),
    reload: context.reload,
    set: context.set,
    signal: context.signal,
  };
}

function serializeData<TData>(data: TData): string {
  return JSON.stringify(data);
}

function deserializeItem<TResult>(item: string | null): TResult | undefined {
  if (item === null) return undefined;
  try {
    return JSON.parse(item);
  } catch {
    if (isNaN(+item)) return +item as TResult;
    if (item === "true") return true as TResult;
    if (item === "false") return false as TResult;
    return item as TResult;
  }
}
