import { Mutex as AsyncMutex } from "async-mutex";

import { Cache, type CacheTypes } from "../Cache";
import { errors } from "../errors";
import { isSSR } from "../isSSR";
import { type AsyncFunc } from "../types";
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
  private readonly mutex: CacheTypes.Mutex;

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
      mutexFactory: () => this.mutex,
      storage: new Storage(
        storageName,
        options?.storage || "session",
        options?.version || "",
      ),
    });

    this.mutex = isSSR()
      ? new AsyncMutex()
      : new StorageMutex(
          storageName,
          options?.storage || "session",
          options?.version || "",
        );

    deleteOlderStorages(
      storageName,
      options?.storage || "session",
      options?.version || "",
    );
  }
}

class Storage implements CacheTypes.Storage {
  private readonly name: string;
  private readonly type: "local" | "session";

  constructor(
    storageName: string,
    storageType: "local" | "session",
    version: string,
  ) {
    this.name = `${storageName}${!!version ? `.${version}` : ""}`;
    this.type = storageType;
  }

  getEntry(key: string): CacheTypes.Entry | undefined {
    if (isSSR()) return undefined;

    const raw = window[`${this.type}Storage`].getItem(this.name);

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

    const raw = window[`${this.type}Storage`].getItem(this.name);

    try {
      const entries = JSON.parse(raw || "{}");
      entries[key] =
        "error" in entry
          ? { ...entry, error: errors.getMessage(entry.error) }
          : entry;

      window[`${this.type}Storage`].setItem(this.name, JSON.stringify(entries));
    } catch {
      return;
    }
  }
}

class StorageMutex implements CacheTypes.Mutex {
  private readonly name: string;

  constructor(name: string);

  constructor(
    storageName: string,
    storageType: "local" | "session",
    version: string,
  );

  constructor(
    storageNameOrName: string,
    storageType?: "local" | "session",
    version?: string,
  ) {
    this.name = !storageType
      ? storageNameOrName
      : `${storageType}.${storageNameOrName}${!!version ? `.${version}` : ""}`;
  }

  async runExclusive<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return await window.navigator.locks.request(this.name, callback);
  }
}

async function deleteOlderStorages(
  storageName: string,
  storageType: "local" | "session",
  version: string,
): Promise<void> {
  if (isSSR()) return;

  const name = `${storageName}${!!version ? `.${version}` : ""}`;
  const keysToDelete = new Array<string>();

  for (let i = 0; i < window[`${storageType}Storage`].length; i++) {
    const key = window[`${storageType}Storage`].key(i);
    if (!key) continue;
    if (key === name) continue;
    if (!key.startsWith(storageName)) continue;
    keysToDelete.push(key);
  }

  await Promise.all(
    keysToDelete.map((key) =>
      new StorageMutex(`${storageType}.${key}`).runExclusive(async () =>
        window[`${storageType}Storage`].removeItem(key),
      ),
    ),
  );
}
