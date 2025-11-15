import { Mutex as AsyncMutex } from "async-mutex";

import { errors } from "../errors";
import { type AsyncFunc, type Func } from "../types";
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
  /**
   * Error thrown when there is not enough space to store a cache entry.
   */
  static readonly NOT_ENOUGH_SPACE_ERROR = new Error("Not enough space");

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
      mutexFactory: options?.mutexFactory || ((key) => new DefaultMutex(key)),
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

    if (!this.mutexes[""])
      this.mutexes[""] = this.options.mutexFactory(undefined);

    signal = signal || this.signal;
    let newEntry: Entry;

    try {
      return this.mutexes[""].runShared(() =>
        this.mutexes[key].runExclusive(async () => {
          signal.throwIfAborted();
          const entry = await this.options.storage.getEntry(key, signal);

          if (!entry || byPassExpiration || Date.now() >= entry.expiresAt) {
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
              const now = Date.now();

              newEntry = {
                createdAt: now,
                expiresAt:
                  typeof expiresAt === "undefined"
                    ? now + this.options.maxCacheTime
                    : typeof expiresAt === "number"
                      ? expiresAt
                      : expiresAt(result),
                result,
              };

              if (Date.now() < newEntry.expiresAt)
                await this.options.storage.setEntry(key, newEntry, signal);

              return newEntry;
            } catch (error) {
              signal.throwIfAborted();
              if (error === Cache.NOT_ENOUGH_SPACE_ERROR) throw error;

              const now = Date.now();

              newEntry = {
                createdAt: now,
                error,
                expiresAt: now + this.options.maxErrorTime,
              };

              if (Date.now() < newEntry.expiresAt)
                await this.options.storage.setEntry(key, newEntry, signal);

              return newEntry;
            }
          }

          return entry;
        }),
      );
    } catch (error) {
      if (error !== Cache.NOT_ENOUGH_SPACE_ERROR) throw error;

      return await this.mutexes[""].runExclusive(async () => {
        const entry = await this.options.storage.getEntry(key, this.signal);

        const keys = await this.options.storage.getKeys(this.signal);
        await Promise.all(
          keys.map(async (key) => {
            const entry = await this.options.storage.getEntry(key, this.signal);
            if (!entry) return;

            if (Date.now() < entry.expiresAt) return;
            await this.options.storage.deleteEntry(key, this.signal);
          }),
        );

        if (!!entry && entry.createdAt > newEntry.createdAt) return entry;

        if (Date.now() < newEntry.expiresAt)
          await this.options.storage.setEntry(key, newEntry, this.signal);

        return newEntry;
      });
    }
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
   * @param factoryOrValue - The value to store in the cache or a function that produces the value to be cached.
   * @param signal - An AbortSignal to cancel the operation if needed.
   * @param expiresAt - Optional. Specifies the expiration time for the cached item. It can be:
   *   - A number representing the absolute expiration timestamp.
   *   - A function that takes the value as input and returns the expiration timestamp.
   *   - If not provided, the default `maxCacheTime` will be used.
   *
   * @returns A Promise resolving to the newly created value.
   */
  async set<TValue>(
    key: string,
    factoryOrValue:
      | TValue
      | Func<TValue>
      | AsyncFunc<TValue, [signal: AbortSignal]>,
    signal?: AbortSignal,
    expiresAt?: number | Func<number, [value: TValue]>,
  ): Promise<TValue> {
    const item = await this.rawSet(
      key,
      factoryOrValue,
      true,
      signal,
      expiresAt,
    );
    if ("result" in item) return item.result;
    throw item.error;
  }
}

class DefaultMutex implements Mutex {
  private readonly key: string | undefined;
  private readonly mutex: AsyncMutex;

  constructor(key: string | undefined) {
    this.key = key;
    this.mutex = new AsyncMutex();
  }

  runExclusive<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return !!this.key
      ? this.mutex.runExclusive(callback)
      : errors.emit("Method not supported");
  }

  runShared<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return !!this.key ? errors.emit("Method not supported") : callback();
  }
}

class DefaultStorage implements Storage {
  private readonly entries: Record<string, Entry>;

  constructor() {
    this.entries = {};
  }

  async deleteEntry(key: string): Promise<void> {
    delete this.entries[key];
  }

  async getKeys(): Promise<string[]> {
    return Object.keys(this.entries);
  }

  async getEntry(key: string): Promise<Entry | undefined> {
    return this.entries[key];
  }

  async setEntry(key: string, entry: Entry): Promise<void> {
    this.entries[key] = entry;
  }
}
