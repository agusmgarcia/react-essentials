import { Mutex as AsyncMutex } from "async-mutex";

import { Cache, type CacheTypes } from "../Cache";
import { errors } from "../errors";
import { isSSR } from "../isSSR";
import { type Options } from "./StorageCache.types";

/**
 * A specialized cache implementation that uses browser storage mechanisms
 * (`localStorage` or `sessionStorage`) to persist cached items across sessions.
 * This class extends the `Cache` class and provides additional functionality
 * for interacting with browser storage.
 *
 * @remarks
 * This class is designed to work in environments where browser storage is available.
 * It gracefully handles server-side rendering (SSR) scenarios by avoiding storage access.
 *
 * @extends Cache
 */
export default class StorageCache extends Cache {
  /**
   * Creates an instance of the `StorageCache` class.
   *
   * @param storageName - The name of the storage to be used for caching.
   * @param options - Optional configuration options for the cache.
   */
  constructor(storageName: string, options?: Partial<Options>) {
    super({
      maxCacheTime: options?.maxCacheTime,
      maxErrorTime: options?.maxErrorTime,
      mutexFactory: (key) => mutexFactory(storageName, key),
      storage: new Storage(
        `${storageName}${!!options?.version ? `.${options.version}` : ""}`,
        options?.storage || "session",
      ),
    });
    deleteOlderStorages(
      options?.storage || "session",
      storageName,
      options?.version || "",
    );
  }
}

class Storage implements CacheTypes.Storage {
  private readonly storageName: string;
  private readonly storageType: "local" | "session";

  constructor(storageName: string, storageType: "local" | "session") {
    this.storageName = storageName;
    this.storageType = storageType;
  }

  getEntry(key: string): CacheTypes.Entry | undefined {
    if (isSSR()) return undefined;

    const raw = window[`${this.storageType}Storage`].getItem(this.storageName);

    try {
      const entries = JSON.parse(raw || "{}");
      return "error" in entries[key]
        ? { ...entries[key], error: new Error(entries[key].error) }
        : entries[key];
    } catch {
      return undefined;
    }
  }

  setEntry(key: string, entry: CacheTypes.Entry): void {
    if (isSSR()) return;

    const raw = window[`${this.storageType}Storage`].getItem(this.storageName);

    try {
      const entries = JSON.parse(raw || "{}");
      entries[key] =
        "error" in entry
          ? { ...entry, error: errors.getMessage(entry.error) }
          : entry;

      window[`${this.storageType}Storage`].setItem(
        this.storageName,
        JSON.stringify(entries),
      );
    } catch {
      return;
    }
  }
}

function mutexFactory(storageName: string, key: string): CacheTypes.Mutex {
  if (isSSR()) return new AsyncMutex();

  return (((window.__REACT_ESSENTIALS_STORAGE_CACHES__ ||= {})[storageName] ||=
    {})[key] ||= new AsyncMutex());
}

function deleteOlderStorages(
  storage: "local" | "session",
  storageName: string,
  version: string,
): void {
  if (isSSR()) return;

  const realStorageName = `${storageName}${!!version ? `.${version}` : ""}`;
  const keysToDelete = new Array<string>();

  for (let i = 0; i < window[`${storage}Storage`].length; i++) {
    const key = window[`${storage}Storage`].key(i);
    if (!key) continue;
    if (key === realStorageName) continue;
    if (!key.startsWith(storageName)) continue;
    keysToDelete.push(key);
  }

  keysToDelete.forEach((key) => window[`${storage}Storage`].removeItem(key));
}
