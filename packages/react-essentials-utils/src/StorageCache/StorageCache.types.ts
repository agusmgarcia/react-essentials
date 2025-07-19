import { type CacheTypes } from "../Cache";

/**
 * Options for configuring the storage cache behavior.
 *
 * @property maxCacheTime - The maximum time in milliseconds that cached items are considered valid.
 *   Defaults to 15 minutes (900,000 ms).
 * @property maxErrorTime - The maximum time in milliseconds that errors are cached before they are considered expired.
 *   Defaults to 1 second (1,000 ms).
 * @property storage - The storage type to use for caching. Can be either "local" for `localStorage` or "session" for `sessionStorage`.
 *   Defaults to "session".
 * @property version - The version of the cache. Used to differentiate between different versions of the cache.
 *   If not provided, the cache will not include a version suffix in the storage key. Useful for cache invalidation when the structure of cached items changes.
 */
export type Options = {
  /**
   * The maximum time in milliseconds that cached items are considered valid.
   * Defaults to 15 minutes (900,000 ms).
   */
  maxCacheTime: number;

  /**
   * The maximum time in milliseconds that errors are cached before they are considered expired.
   * Defaults to 1 second (1,000 ms).
   */
  maxErrorTime: number;

  /**
   * The storage type to use for caching.
   * Can be either "local" for `localStorage` or "session" for `sessionStorage`.
   * Defaults to "session".
   */
  storage: "local" | "session";

  /**
   * The version of the cache.
   * This is used to differentiate between different versions of the cache.
   * If not provided, the cache will not include a version suffix in the storage key.
   * This can be useful for cache invalidation when the structure of cached items changes.
   */
  version: string;
};

declare global {
  interface Window {
    __REACT_ESSENTIALS_STORAGE_CACHES__?: Record<
      string,
      Record<string, CacheTypes.Mutex>
    >;
  }
}
