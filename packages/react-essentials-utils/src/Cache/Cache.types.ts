import { type AsyncFunc, type Func } from "../types";

/**
 * Configuration options for initializing the cache.
 */
export type Options = {
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

  /**
   * A factory function that creates a mutex instance for a given cache key.
   * This allows for fine-grained locking mechanisms on cache operations per key.
   *
   * @param key - The unique identifier for the cache entry that requires a mutex.
   *   In case of global mutex, the key is `undefined`.
   *
   * @returns An instance of `IMutex` associated with the specified key.
   */
  mutexFactory: Func<Mutex, [key: string | undefined]>;

  /**
   * The storage mechanism used for persisting cache entries.
   * This should implement the `Storage` interface, allowing for custom or built-in storage solutions (e.g., localStorage, sessionStorage, or in-memory storage).
   */
  storage: Storage;
};

/**
 * Interface for cache storage operations.
 *
 * Provides methods to get and set cache entries, supporting both synchronous and asynchronous
 * implementations. The methods may optionally accept an AbortSignal for cancellation support.
 */
export interface Storage {
  /**
   * Deletes a cache entry.
   *
   * @param key - The unique identifier for the cache entry to delete.
   * @param signal - An AbortSignal to support cancellation of the operation.
   */
  deleteEntry(key: string, signal: AbortSignal): Promise<void>;

  /**
   * Retrieves a cache entry.
   *
   * @param key - The unique identifier for the cache entry to retrieve.
   * @param signal - An AbortSignal to support cancellation of the operation.
   */
  getEntry(key: string, signal: AbortSignal): Promise<Entry | undefined>;

  /**
   * Retrieves all cache keys.
   *
   * @param signal - An AbortSignal to support cancellation of the operation.
   */
  getKeys(signal: AbortSignal): Promise<string[]>;

  /**
   * Stores a cache entry.
   *
   * @param key - The unique identifier for the cache entry to store.
   * @param entry - The cache entry to store.
   * @param signal - An AbortSignal to support cancellation of the operation.
   */
  setEntry(key: string, entry: Entry, signal: AbortSignal): Promise<void>;
}

/**
 * Represents a mutual exclusion lock interface for running asynchronous functions exclusively.
 * @template TResult The result type returned by the callback function.
 */
export interface Mutex {
  /**
   * Runs the provided callback function exclusively, ensuring no other operations
   * are running concurrently within the mutex.
   *
   * @param callback - An asynchronous function to execute exclusively.
   * @returns A promise that resolves with the result of the callback.
   */
  runExclusive<TResult>(callback: AsyncFunc<TResult>): Promise<TResult>;

  /**
   * Runs the provided callback function in shared mode, allowing concurrent access.
   *
   * @param callback - An asynchronous function to execute in shared mode.
   * @returns A promise that resolves with the result of the callback.
   */
  runShared<TResult>(callback: AsyncFunc<TResult>): Promise<TResult>;
}

/**
 * Represents a cache entry, which can either store a successful result or an error,
 * along with its expiration timestamp.
 */
export type Entry = {
  /**
   * The timestamp (in milliseconds since epoch) when the entry has been created.
   */
  createdAt: number;

  /**
   * The timestamp (in milliseconds since epoch) when the entry expires.
   */
  expiresAt: number;
} & (
  | {
      /**
       * The cached result value (if the entry is a successful result).
       */
      result: any;
    }
  | {
      /**
       *  The cached error value (if the entry is an error).
       */
      error: any;
    }
);
