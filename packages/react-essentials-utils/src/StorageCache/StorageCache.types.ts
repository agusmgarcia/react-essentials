/**
 * Options for configuring the storage cache behavior.
 *
 * @property maxCacheTime - The maximum time in milliseconds that cached items are considered valid.
 *   Defaults to 15 minutes (900,000 ms).
 * @property maxErrorTime - The maximum time in milliseconds that errors are cached before they are considered expired.
 *   Defaults to 1 second (1,000 ms).
 * @property storage - The storage type to use for caching. Can be either "local" for `localStorage` or "session" for `sessionStorage`.
 *   Defaults to "session".
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
};
