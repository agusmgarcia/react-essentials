import { Mutex as AsyncMutex } from "async-mutex";

import type AsyncFunc from "../AsyncFunc.types";
import type Func from "../Func.types";
import {
  type Entry,
  type Mutex,
  type Options,
  type Storage,
} from "./Cache.types";

/**
 * A utility class for caching asynchronous operations with expiration times.
 */
export default class Cache {
  private readonly options: Options;
  private readonly mutexes: Record<string, Mutex>;
  private readonly signal: AbortSignal;

  /**
   * Creates an instance of the Cache class.
   *
   * @param options - Optional configuration for the cache.
   */
  constructor(options?: Partial<Options>) {
    this.options = {
      maxCacheTime: options?.maxCacheTime || 900_000,
      maxErrorTime: options?.maxErrorTime || 1_000,
      mutexFactory: options?.mutexFactory || defaultMutexFactory,
      storage: options?.storage || new DefaultStorage(),
    };
    this.mutexes = {};
    this.signal = new AbortController().signal;
  }

  private async rawSet<TResult>(
    key: string,
    factory:
      | TResult
      | Func<TResult>
      | AsyncFunc<TResult, [signal: AbortSignal]>,
    byPassExpiration: boolean,
    signal: AbortSignal | undefined,
    expiresAt: number | Func<number, [result: TResult]> | undefined,
  ): Promise<Entry> {
    if (!this.mutexes[key]) this.mutexes[key] = this.options.mutexFactory(key);
    signal = signal || this.signal;

    return this.mutexes[key].runExclusive(async () => {
      signal.throwIfAborted();
      const entry = await this.options.storage.getEntry(key, signal);

      if (byPassExpiration || !entry || Date.now() >= entry.expiresAt) {
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
              ? Date.now() + this.options.maxCacheTime
              : typeof expiresAt === "number"
                ? expiresAt
                : expiresAt(result);

          const newEntry = { expiresAt, result };
          await this.options.storage.setEntry(key, newEntry, signal);

          return newEntry;
        } catch (error) {
          signal.throwIfAborted();
          expiresAt = Date.now() + this.options.maxErrorTime;

          const newEntry = { error, expiresAt };
          await this.options.storage.setEntry(key, newEntry, signal);

          return newEntry;
        }
      }

      return entry;
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
    signal?: AbortSignal,
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
   * @param signal - An AbortSignal to cancel the operation if needed.
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
    signal?: AbortSignal,
    expiresAt?: number | Func<number, [value: TValue]>,
  ): Promise<void> {
    const item = await this.rawSet(key, value, true, signal, expiresAt);
    if ("result" in item) return;
    throw item.error;
  }
}

function defaultMutexFactory(): Mutex {
  return new AsyncMutex();
}

class DefaultStorage implements Storage {
  private readonly entries: Record<string, Entry>;

  constructor() {
    this.entries = {};
  }

  getEntry(key: string): Entry | undefined {
    return this.entries[key];
  }

  setEntry(key: string, entry: Entry): void {
    this.entries[key] = entry;
  }
}
