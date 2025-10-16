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
   * @returns An instance of `IMutex` associated with the specified key.
   */
  mutexFactory: Func<Mutex, [key: string]>;

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
export type Storage = {
  /**
   * Retrieves a cache entry. Can be a synchronous or asynchronous function.
   * If asynchronous, it may accept an AbortSignal to support cancellation.
   */
  getEntry:
    | Func<Entry | undefined, [key: string]>
    | AsyncFunc<Entry | undefined, [key: string, signal: AbortSignal]>;

  /**
   * Stores a cache entry. Can be a synchronous or asynchronous function.
   * If asynchronous, it may accept the entry and an AbortSignal to support cancellation.
   */
  setEntry:
    | Func<void, [key: string, entry: Entry]>
    | AsyncFunc<void, [key: string, entry: Entry, signal: AbortSignal]>;
};

/**
 * Represents a mutual exclusion lock interface for running asynchronous functions exclusively.
 * @template TResult The result type returned by the callback function.
 */
export type Mutex = {
  /**
   * Runs the provided callback function exclusively, ensuring no other operations
   * are running concurrently within the mutex.
   * @param callback - An asynchronous function to execute exclusively.
   * @returns A promise that resolves with the result of the callback.
   */
  runExclusive<TResult>(callback: AsyncFunc<TResult>): Promise<TResult>;
};

/**
 * Represents a cache entry, which can either store a successful result or an error,
 * along with its expiration timestamp.
 */
export type Entry = {
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
