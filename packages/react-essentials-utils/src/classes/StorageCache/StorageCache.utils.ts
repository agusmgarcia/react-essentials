import { v4 as createUUID } from "uuid";

import { type CacheTypes } from "#src/classes";
import { errors, strings } from "#src/modules";
import { type AsyncFunc } from "#src/types";

import { type Options } from "./StorageCache.types";

export class Mutex implements CacheTypes.Mutex {
  private readonly _storage: Options["storage"];
  private readonly _key: string;

  constructor(storage: Options["storage"], key: string | undefined) {
    this._storage = storage;
    this._key = key || "";
  }

  async runShared<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return await window.navigator.locks.request(
      `${this._key}__${await this.getStorageId()}`,
      { mode: "shared" },
      callback,
    );
  }

  async runExclusive<TResult>(callback: AsyncFunc<TResult>): Promise<TResult> {
    return await window.navigator.locks.request(
      `${this._key}__${await this.getStorageId()}`,
      { mode: "exclusive" },
      callback,
    );
  }

  private async getStorageId(): Promise<string> {
    const storageIdKey = `${strings.capitalize(this._storage)}StorageId`;

    return (
      (await window.navigator.locks.request(
        storageIdKey,
        { mode: "shared" },
        () =>
          window[`${this._storage}Storage`].getItem(storageIdKey) || undefined,
      )) ||
      (await window.navigator.locks.request(
        storageIdKey,
        { mode: "exclusive" },
        () => {
          const id =
            window[`${this._storage}Storage`].getItem(storageIdKey) ||
            createUUID();

          window[`${this._storage}Storage`].setItem(storageIdKey, id);

          return id;
        },
      ))
    );
  }
}

export class Storage implements CacheTypes.Storage {
  private readonly storage: Options["storage"];
  private readonly notEnoughSpaceError: Error;

  constructor(storage: Options["storage"], notEnoughSpaceError: Error) {
    this.storage = storage;
    this.notEnoughSpaceError = notEnoughSpaceError;
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
      throw this.notEnoughSpaceError;
    }
  }
}
