import { Mutex as AsyncMutex } from "async-mutex";

import { errors } from "../errors";
import StorageCache from "./StorageCache";

jest.mock("../isSSR", () => ({ isSSR: jest.fn().mockReturnValue(false) }));

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
    const cache = new StorageCache("testCache", { storage: "local" });

    const value = await cache.getOrCreate(
      "foo",
      () => "bar",
      new AbortController().signal,
    );

    expect(value).toBe("bar");

    const stored = JSON.parse(localStorage.getItem("testCache")!);
    expect(stored.foo.result).toBe("bar");
  });

  it("should store and retrieve values using sessionStorage", async () => {
    const cache = new StorageCache("testCache");

    const value = await cache.getOrCreate(
      "baz",
      () => "qux",
      new AbortController().signal,
    );

    expect(value).toBe("qux");

    const stored = JSON.parse(sessionStorage.getItem("testCache")!);
    expect(stored.baz.result).toBe("qux");
  });

  it("should use the factory only if value is not cached", async () => {
    const cache = new StorageCache("testCache", { storage: "local" });
    const factory = jest.fn(() => "abc");

    await cache.getOrCreate("key", factory, new AbortController().signal);
    await cache.getOrCreate("key", factory, new AbortController().signal);

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should handle errors from factory and cache them briefly", async () => {
    const cache = new StorageCache("testCache", { storage: "local" });
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
    const cache = new StorageCache("testCache", { storage: "local" });
    await cache.set("direct", 123);

    const stored = JSON.parse(localStorage.getItem("testCache")!);
    expect(stored.direct.result).toBe(123);
  });

  it("should respect expiresAt function", async () => {
    const cache = new StorageCache("testCache", { storage: "local" });
    const expiresAt = jest.fn(() => Date.now() + 5000);

    await cache.getOrCreate(
      "exp",
      () => "val",
      new AbortController().signal,
      expiresAt,
    );

    expect(expiresAt).toHaveBeenCalledWith("val");

    const stored = JSON.parse(localStorage.getItem("testCache")!);
    expect(stored.exp.expiresAt).toBeGreaterThan(Date.now());
  });

  it("should use versioned storage name and delete older versions", async () => {
    localStorage.setItem("testCache", JSON.stringify({ old: { result: 1 } }));
    localStorage.setItem("testCache.1", JSON.stringify({ v1: { result: 2 } }));
    localStorage.setItem("testCache.2", JSON.stringify({ v2: { result: 3 } }));

    const cache = new StorageCache("testCache", {
      storage: "local",
      version: "2",
    });
    await cache.set("foo", "bar");

    expect(localStorage.getItem("testCache")).toBeNull();
    expect(localStorage.getItem("testCache.1")).toBeNull();

    const stored = JSON.parse(localStorage.getItem("testCache.2")!);
    expect(stored.foo.result).toBe("bar");
  });

  it("should use unversioned storage name if version is empty", async () => {
    const cache = new StorageCache("myCache");
    await cache.set("a", 42);

    const stored = JSON.parse(sessionStorage.getItem("myCache")!);
    expect(stored.a.result).toBe(42);
  });

  it("should use versioned storage name if version is provided", async () => {
    const cache = new StorageCache("myCache", { version: "v5" });
    await cache.set("b", 99);

    const stored = JSON.parse(sessionStorage.getItem("myCache.v5")!);
    expect(stored.b.result).toBe(99);
  });

  it("should not delete unrelated keys in storage", async () => {
    localStorage.setItem("unrelated", JSON.stringify({}));

    const cache = new StorageCache("testCache", {
      storage: "local",
      version: "v1",
    });

    await cache.set("foo", "bar");

    expect(localStorage.getItem("unrelated")).not.toBeNull();
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
    callback?: LockGrantedCallback<LockGrantedCallback<TResult>>,
  ): Promise<TResult> {
    if (typeof callbackOrOptions !== "function" || !!callback)
      throw new Error("Method not implemented.");

    if (!this.mutexes[name]) this.mutexes[name] = new AsyncMutex();
    return await this.mutexes[name].runExclusive(() => callbackOrOptions(null));
  }
}
