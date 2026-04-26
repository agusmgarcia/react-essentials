import { Mutex as AsyncMutex } from "async-mutex";

import { errors } from "#src/modules";
import { type AsyncFunc } from "#src/types";

import { type Entry, type Mutex, type Storage } from "./Cache.types";

export class DefaultMutex implements Mutex {
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

export class DefaultStorage implements Storage {
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
