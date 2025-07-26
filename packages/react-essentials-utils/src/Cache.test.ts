import Cache from "./Cache";
import delay from "./delay";

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

  it("should initialize cache with items from a resolved promise", async () => {
    const initialItems = {
      err: { error: new Error("init error"), expiresAt: Date.now() + 1000 },
      foo: { expiresAt: Date.now() + 1000, result: "bar" },
    };
    const cache = new Cache({ items: Promise.resolve(initialItems) });

    // Should retrieve pre-cached value
    const factory = jest.fn();
    const result = await cache.getOrCreate(
      "foo",
      factory,
      new AbortController().signal,
    );
    expect(result).toBe("bar");
    expect(factory).not.toHaveBeenCalled();

    // Should throw pre-cached error
    await expect(
      cache.getOrCreate("err", factory, new AbortController().signal),
    ).rejects.toThrow("init error");
    expect(factory).not.toHaveBeenCalled();
  });

  it("should initialize cache with items from a direct object", async () => {
    const expiresAt = Date.now() + 1000;

    const cache = new Cache({
      items: {
        a: { expiresAt, result: 123 },
        b: { error: new Error("fail b"), expiresAt },
      },
    });

    const factory = jest.fn();
    const result = await cache.getOrCreate(
      "a",
      factory,
      new AbortController().signal,
    );
    expect(result).toBe(123);
    expect(factory).not.toHaveBeenCalled();

    await expect(
      cache.getOrCreate("b", factory, new AbortController().signal),
    ).rejects.toThrow("fail b");
    expect(factory).not.toHaveBeenCalled();
  });

  it("should wait for promise items to resolve before serving requests", async () => {
    async function loadItems() {
      await delay(10);
      return {};
    }

    const cache = new Cache({ items: loadItems() });
    const factory = jest.fn().mockResolvedValue("late");

    // Start getOrCreate before items are resolved
    const result = await cache.getOrCreate(
      "lateKey",
      factory,
      new AbortController().signal,
    );

    expect(result).toBe("late");
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("should use initial items and expire them correctly", async () => {
    const cache = new Cache({
      items: {
        exp: { expiresAt: Date.now() + 10, result: "soon" },
      },
    });

    const factory = jest.fn().mockResolvedValue("after");

    // Should get initial value
    const result1 = await cache.getOrCreate(
      "exp",
      factory,
      new AbortController().signal,
    );
    expect(result1).toBe("soon");
    expect(factory).not.toHaveBeenCalled();

    // Wait for expiration
    await delay(20);
    const result2 = await cache.getOrCreate(
      "exp",
      factory,
      new AbortController().signal,
    );
    expect(result2).toBe("after");
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
