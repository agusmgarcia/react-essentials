import delay from "./delay";

describe("delay", () => {
  it("resolves after the specified delay", async () => {
    const start = Date.now();
    await delay(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });

  it("rejects immediately if the AbortSignal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(delay(100, controller.signal)).rejects.toThrow();
  });

  it("rejects if the AbortSignal is aborted during the delay", async () => {
    const controller = new AbortController();
    const promise = delay(100, controller.signal);

    setTimeout(() => controller.abort(), 50);

    await expect(promise).rejects.toThrow();
  });

  it("cleans up the abort event listener after rejecting", async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const spy = jest.spyOn(signal, "removeEventListener");

    const promise = delay(100, signal);
    controller.abort();

    await expect(promise).rejects.toThrow();
    expect(spy).toHaveBeenCalledWith("abort", expect.any(Function));
    spy.mockRestore();
  });

  it("does not start a timer when the signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const addEventListenerSpy = jest.spyOn(
      controller.signal,
      "addEventListener",
    );

    await expect(delay(100, controller.signal)).rejects.toThrow();

    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
    addEventListenerSpy.mockRestore();
  });
});
