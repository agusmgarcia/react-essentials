import { Mutex as AsyncMutex } from "async-mutex";

import { errors } from "../errors";
import StorageCache from "./StorageCache";

jest.mock("uuid", () => ({ v4: () => "id" }));

describe("StorageCache", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: new StorageMock(),
      writable: true,
    });
    Object.defineProperty(window, "sessionStorage", {
      value: new StorageMock(),
      writable: true,
    });
    Object.defineProperty(window.navigator, "locks", {
      value: new LocksMock(),
      writable: true,
    });
  });

  it("should store and retrieve values using localStorage", async () => {
    const cache = new StorageCache({ storage: "local" });

    const value = await cache.getOrCreate(
      "foo",
      () => "bar",
      new AbortController().signal,
    );

    expect(value).toBe("bar");

    const stored = JSON.parse(localStorage.getItem("foo")!);
    expect(stored.result).toBe("bar");
  });

  it("should store and retrieve values using sessionStorage", async () => {
    const cache = new StorageCache({ storage: "session" });

    const value = await cache.getOrCreate(
      "foo",
      () => "bar",
      new AbortController().signal,
    );

    expect(value).toBe("bar");

    const stored = JSON.parse(sessionStorage.getItem("foo")!);
    expect(stored.result).toBe("bar");
  });

  it("should use the factory only if value is not cached", async () => {
    const cache = new StorageCache({ storage: "local" });
    const factory = jest.fn(() => "abc");

    await cache.getOrCreate("key", factory, new AbortController().signal);
    await cache.getOrCreate("key", factory, new AbortController().signal);

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should handle errors from factory and cache them briefly", async () => {
    const cache = new StorageCache({ storage: "local" });
    const factory = jest.fn(() => errors.emit("fail"));

    await expect(
      cache.getOrCreate("err", factory, new AbortController().signal),
    ).rejects.toThrow("fail");

    // Try again, should not call factory again (error is cached)
    await expect(
      cache.getOrCreate("err", factory, new AbortController().signal),
    ).rejects.toThrow("fail");

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should allow setting values directly", async () => {
    const cache = new StorageCache({ storage: "local" });
    await cache.set("direct", 123);

    const stored = JSON.parse(localStorage.getItem("direct")!);
    expect(stored.result).toBe(123);
  });

  it("should respect expiresAt function", async () => {
    const cache = new StorageCache({ storage: "local" });
    const expiresAt = jest.fn(() => Date.now() + 5000);

    await cache.getOrCreate(
      "exp",
      () => "val",
      new AbortController().signal,
      expiresAt,
    );

    expect(expiresAt).toHaveBeenCalledWith("val");

    const stored = JSON.parse(localStorage.getItem("exp")!);
    expect(stored.expiresAt).toBeGreaterThan(Date.now());
  });
});

class StorageMock implements Storage {
  private readonly records: Map<string, string>;

  constructor() {
    this.records = new Map();
  }

  get length(): number {
    return this.records.size;
  }

  clear(): void {
    throw new Error("Method not implemented.");
  }

  getItem(key: string): string | null {
    const value = this.records.get(key);
    return typeof value !== "undefined" ? value : null;
  }

  key(index: number): string | null {
    const key = this.records.keys().toArray().at(index);
    return typeof key !== "undefined" ? key : null;
  }

  removeItem(key: string): void {
    this.records.delete(key);
  }

  setItem(key: string, value: string): void {
    this.records.set(key, value);
  }
}

class LocksMock implements LockManager {
  private readonly mutexes: Record<string, AsyncMutex>;

  constructor() {
    this.mutexes = {};
  }

  query(): Promise<LockManagerSnapshot> {
    throw new Error("Method not implemented.");
  }

  async request<TResult>(
    name: string,
    callbackOrOptions: LockOptions | LockGrantedCallback<TResult>,
    callback?: LockGrantedCallback<TResult>,
  ): Promise<TResult> {
    const optionsToUse =
      typeof callbackOrOptions !== "function" ? callbackOrOptions : undefined;

    const callbackToUse =
      typeof callbackOrOptions === "function"
        ? callbackOrOptions
        : !!callback
          ? callback
          : errors.emit("Invalid arguments");

    if (optionsToUse?.mode === "shared") return await callbackToUse(null);

    if (!this.mutexes[name]) this.mutexes[name] = new AsyncMutex();
    return await this.mutexes[name].runExclusive(() => callbackToUse(null));
  }
}
