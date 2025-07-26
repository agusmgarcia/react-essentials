import { Mutex } from "async-mutex";

import type AsyncFunc from "./AsyncFunc.types";
import type Func from "./Func.types";

/**
 * A utility class for caching asynchronous operations with expiration times.
 */
export default class Cache {
  private readonly maxCacheTime: number;
  private readonly maxErrorTime: number;

  private readonly mutexes: Record<string, Mutex>;
  private readonly items: Items;
  private readonly itemsPromise: Promise<void>;
  private readonly signal: AbortSignal;

  /**
   * Creates an instance of the Cache class.
   *
   * @param options - Optional configuration for the cache.
   */
  constructor(options?: Partial<Options>) {
    this.maxCacheTime = options?.maxCacheTime || 900_000;
    this.maxErrorTime = options?.maxErrorTime || 1_000;
    this.mutexes = {};
    this.items = {};
    this.itemsPromise = (
      options?.items instanceof Promise
        ? options.items
        : Promise.resolve(options?.items || {})
    ).then((items) =>
      Object.keys(items).forEach((k) => (this.items[k] = items[k])),
    );
    this.signal = new AbortController().signal;
  }

  /**
   * Stores a value in the cache under the specified key, with support for concurrency control and custom expiration logic.
   *
   * @typeParam TResult - The type of the result produced by the factory.
   *
   * @param key - The unique key identifying the cached item.
   * @param factory - The value or factory function to produce the value to be cached. Can be a direct value, a synchronous function, or an asynchronous function accepting an AbortSignal.
   * @param byPassExpiration - If true, bypasses expiration checks and forces the factory to run.
   * @param signal - An AbortSignal to allow cancellation of the operation.
   * @param expiresAt - Optional. Specifies the expiration time for the cached item. Can be:
   *   - A number representing the absolute expiration timestamp.
   *   - A function that takes the result as input and returns the expiration timestamp.
   *   - If not provided, the default `maxCacheTime` will be used.
   *
   * @returns A Promise resolving to the cached item, which contains either the result or an error and its expiration time.
   *
   * @remarks
   * This method ensures that only one factory execution occurs per key at a time using a mutex.
   * If the factory throws an error, the error is cached and re-thrown for the following second.
   * If `byPassExpiration` is true, the cache is always refreshed regardless of expiration.
   */
  protected async rawSet<TResult>(
    key: string,
    factory:
      | TResult
      | Func<TResult>
      | AsyncFunc<TResult, [signal: AbortSignal]>,
    byPassExpiration: boolean,
    signal: AbortSignal | undefined,
    expiresAt: number | Func<number, [result: TResult]> | undefined,
  ): Promise<Item> {
    await this.itemsPromise;

    if (!this.mutexes[key]) this.mutexes[key] = new Mutex();
    signal = signal || this.signal;

    return this.mutexes[key].runExclusive(async () => {
      signal.throwIfAborted();

      if (
        byPassExpiration ||
        !this.items[key] ||
        Date.now() >= this.items[key].expiresAt
      ) {
        try {
          const result =
            typeof factory === "function"
              ? await (
                  factory as
                    | Func<TResult>
                    | AsyncFunc<TResult, [signal: AbortSignal]>
                )(signal)
              : factory;

          signal.throwIfAborted();

          expiresAt =
            typeof expiresAt === "undefined"
              ? Date.now() + this.maxCacheTime
              : typeof expiresAt === "number"
                ? expiresAt
                : expiresAt(result);

          this.items[key] = { expiresAt, result };
        } catch (error) {
          signal.throwIfAborted();
          expiresAt = Date.now() + this.maxErrorTime;
          this.items[key] = { error, expiresAt };
        }
      }

      return this.items[key];
    });
  }

  /**
   * Retrieves a cached value by key or creates it using the provided factory function if it doesn't exist or has expired.
   *
   * @typeParam TResult - The type of the result produced by the factory function.
   *
   * @param key - The unique key identifying the cached item.
   * @param factory - A function that produces the value to be cached. It can return either a value or a Promise resolving to a value.
   * @param signal - An AbortSignal to cancel the operation if needed.
   * @param expiresAt - Optional. Specifies the expiration time for the cached item. It can be:
   *   - A number representing the absolute expiration timestamp.
   *   - A function that takes the result as input and returns the expiration timestamp.
   *   - If not provided, the default `maxCacheTime` will be used.
   *
   * @returns A Promise resolving to the cached or newly created value.
   *
   * @throws If the factory function throws an error, the error will be cached and re-thrown for the following second.
   */
  async getOrCreate<TResult>(
    key: string,
    factory: Func<TResult> | AsyncFunc<TResult, [signal: AbortSignal]>,
    signal: AbortSignal,
    expiresAt?: number | Func<number, [result: TResult]>,
  ): Promise<TResult> {
    const item = await this.rawSet(key, factory, false, signal, expiresAt);
    if ("result" in item) return item.result as TResult;
    throw item.error;
  }

  /**
   * Stores a value in the cache under the specified key, with an optional expiration time.
   *
   * @typeParam TValue - The type of the value to be cached.
   *
   * @param key - The unique key identifying the cached item.
   * @param value - The value to store in the cache.
   * @param expiresAt - Optional. Specifies the expiration time for the cached item. It can be:
   *   - A number representing the absolute expiration timestamp.
   *   - A function that takes the value as input and returns the expiration timestamp.
   *   - If not provided, the default `maxCacheTime` will be used.
   *
   * @returns A Promise that resolves when the value has been stored in the cache.
   */
  async set<TValue>(
    key: string,
    value: TValue,
    expiresAt?: number | Func<number, [value: TValue]>,
  ): Promise<void> {
    const item = await this.rawSet(key, value, true, undefined, expiresAt);
    if ("result" in item) return;
    throw item.error;
  }
}

type Options = {
  /**
   * The initial items to populate the cache with.
   * Can be a synchronous object or a Promise resolving to an object.
   * If not provided, an empty object will be used.
   */
  items: Items | Promise<Items>;
  /**
   * The maximum time (in milliseconds) that a cached item is considered valid.
   * Defaults to 15 minutes (900,000 ms).
   */
  maxCacheTime: number;
  /**
   * The maximum time (in milliseconds) an error can remain in the cache before it is considered expired.
   * Defaults to 1 second (1,000 ms).
   */
  maxErrorTime: number;
};

type Item = { expiresAt: number } & ({ result: any } | { error: any });

type Items = Record<string, Item>;
