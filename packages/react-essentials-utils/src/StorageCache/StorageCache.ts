import { v4 as createUUID } from "uuid";

import { Cache, type CacheTypes } from "../Cache";
import { errors } from "../errors";
import { strings } from "../strings";
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
      storage: new Storage(options?.storage || "session"),
    });
  }
}

class Mutex implements CacheTypes.Mutex {
  private readonly storage: Options["storage"];
  private readonly key: string;

  constructor(storage: Options["storage"], key: string | undefined) {
    this.storage = storage;
    this.key = key || "";
  }

  async runShared<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return await window.navigator.locks.request(
      `${this.key}__${await this.getStorageId()}`,
      { mode: "shared" },
      callback,
    );
  }

  async runExclusive<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return await window.navigator.locks.request(
      `${this.key}__${await this.getStorageId()}`,
      { mode: "exclusive" },
      callback,
    );
  }

  private async getStorageId(): Promise<string> {
    const storageIdKey = `${strings.capitalize(this.storage)}StorageId`;

    return (
      (await window.navigator.locks.request(
        storageIdKey,
        { mode: "shared" },
        () =>
          window[`${this.storage}Storage`].getItem(storageIdKey) || undefined,
      )) ||
      (await window.navigator.locks.request(
        storageIdKey,
        { mode: "exclusive" },
        () => {
          const id =
            window[`${this.storage}Storage`].getItem(storageIdKey) ||
            createUUID();

          window[`${this.storage}Storage`].setItem(storageIdKey, id);

          return id;
        },
      ))
    );
  }
}

class Storage implements CacheTypes.Storage {
  private readonly storage: Options["storage"];

  constructor(storage: Options["storage"]) {
    this.storage = storage;
  }

  async deleteEntry(key: string): Promise<void> {
    window[`${this.storage}Storage`].removeItem(key);
  }

  async getKeys(): Promise<string[]> {
    const keys = new Array<string>();

    for (let i = 0; i < window[`${this.storage}Storage`].length; i++) {
      const key = window[`${this.storage}Storage`].key(i);
      if (!!key) keys.push(key);
    }

    return keys;
  }

  async getEntry(key: string): Promise<CacheTypes.Entry | undefined> {
    const item = window[`${this.storage}Storage`].getItem(key);
    if (!item) return undefined;

    try {
      const entry: unknown = JSON.parse(item);

      if (typeof entry !== "object") return undefined;

      if (!entry) return undefined;

      if (!("createdAt" in entry) || typeof entry.createdAt !== "number")
        return undefined;

      if (!("expiresAt" in entry) || typeof entry.expiresAt !== "number")
        return undefined;

      if ("result" in entry) return entry as CacheTypes.Entry;

      if (!("error" in entry) || typeof entry.error !== "string")
        return undefined;

      return { ...entry, error: new Error(entry.error) } as CacheTypes.Entry;
    } catch {
      return undefined;
    }
  }

  async setEntry(key: string, entry: CacheTypes.Entry): Promise<void> {
    const raw =
      "error" in entry
        ? { ...entry, error: errors.getMessage(entry.error) }
        : entry;

    try {
      window[`${this.storage}Storage`].setItem(key, JSON.stringify(raw));
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      if (error.code !== DOMException.QUOTA_EXCEEDED_ERR) throw error;
      throw Cache.NOT_ENOUGH_SPACE_ERROR;
    }
  }
}
