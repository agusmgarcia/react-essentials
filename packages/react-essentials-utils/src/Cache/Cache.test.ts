import { delay } from "../delay";
import Cache from "./Cache";

describe("Cache", () => {
  it("should cache and retrieve a value", async () => {
    const cache = new Cache();
    const factory = jest.fn(() => Promise.resolve("foo"));

    const result = await cache.getOrCreate(
      "key",
      factory,
      new AbortController().signal,
    );

    expect(result).toBe("foo");
    expect(factory).toHaveBeenCalledTimes(1);

    // Should return cached value, not call factory again
    const result2 = await cache.getOrCreate(
      "key",
      factory,
      new AbortController().signal,
    );

    expect(result2).toBe("foo");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should expire cache after maxCacheTime", async () => {
    let value = 1;
    const cache = new Cache({ maxCacheTime: 10 });
    const factory = jest.fn(() => Promise.resolve(value++));

    const result1 = await cache.getOrCreate(
      "key",
      factory,
      new AbortController().signal,
    );
    expect(result1).toBe(1);

    // Wait for cache to expire
    await delay(20);
    const result2 = await cache.getOrCreate(
      "key",
      factory,
      new AbortController().signal,
    );
    expect(result2).toBe(2);
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("should allow manual set and retrieve", async () => {
    const cache = new Cache();
    await cache.set("key", 42);

    const factory = jest.fn();
    const result = await cache.getOrCreate(
      "key",
      factory,
      new AbortController().signal,
    );
    expect(result).toBe(42);
    expect(factory).not.toHaveBeenCalled();
  });

  it("should support custom expiresAt as number", async () => {
    const cache = new Cache();
    const factory = jest.fn().mockResolvedValue("bar");
    const expiresAt = Date.now() + 10;

    await cache.getOrCreate(
      "custom",
      factory,
      new AbortController().signal,
      expiresAt,
    );

    // Wait for expiration
    await delay(20);
    await cache.getOrCreate(
      "custom",
      factory,
      new AbortController().signal,
      expiresAt,
    );
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("should support custom expiresAt as function", async () => {
    const cache = new Cache();
    const factory = jest.fn().mockResolvedValue("baz");
    const expiresAtFn = jest.fn().mockReturnValue(Date.now() + 10);
    await cache.getOrCreate(
      "fn",
      factory,
      new AbortController().signal,
      expiresAtFn,
    );

    // Wait for expiration
    await delay(20);
    await cache.getOrCreate(
      "fn",
      factory,
      new AbortController().signal,
      expiresAtFn,
    );
    expect(factory).toHaveBeenCalledTimes(2);
    expect(expiresAtFn).toHaveBeenCalled();
  });

  it("should handle synchronous factory", async () => {
    const cache = new Cache();
    const factory = jest.fn().mockReturnValue("sync");
    const result = await cache.getOrCreate(
      "sync",
      factory,
      new AbortController().signal,
    );
    expect(result).toBe("sync");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should handle AbortSignal abort", async () => {
    const cache = new Cache();

    const controller = new AbortController();
    controller.abort();

    const factory = jest
      .fn()
      .mockImplementation(() => Promise.resolve("should not run"));

    await expect(
      cache.getOrCreate("abort", factory, controller.signal),
    ).rejects.toThrow();
    expect(factory).not.toHaveBeenCalled();
  });

  it("should only run one factory at a time per key (mutex)", async () => {
    let running = false;
    const cache = new Cache();
    const factory = jest.fn().mockImplementation(async () => {
      if (running) throw new Error("Concurrent call");
      running = true;
      await delay(30);
      running = false;
      return "mutex";
    });

    await Promise.all([
      cache.getOrCreate("mutex", factory, new AbortController().signal),
      cache.getOrCreate("mutex", factory, new AbortController().signal),
    ]);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
