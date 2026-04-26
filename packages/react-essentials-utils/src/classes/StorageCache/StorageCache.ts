import { Cache } from "#src/classes";

import { type Options } from "./StorageCache.types";
import { Mutex, Storage } from "./StorageCache.utils";

/**
 * A specialized cache implementation that uses browser storage mechanisms
 * (`localStorage` or `sessionStorage`) to persist cached items across sessions.
 * This class extends the `Cache` class and provides additional functionality
 * for interacting with browser storage.
 *
 * @remarks
 * This class is designed to work in environments where browser storage is available.
 *
 * @extends Cache
 */
export default class StorageCache extends Cache {
  /**
   * Creates an instance of the `StorageCache` class.
   *
   * @param options - Optional configuration options for the cache.
   */
  constructor(options?: Partial<Options>) {
    super({
      maxCacheTime: options?.maxCacheTime,
      maxErrorTime: options?.maxErrorTime,
      mutexFactory: (key) => new Mutex(options?.storage || "session", key),
      storage: new Storage(
        options?.storage || "session",
        Cache.NOT_ENOUGH_SPACE_ERROR,
      ),
    });
  }
}
