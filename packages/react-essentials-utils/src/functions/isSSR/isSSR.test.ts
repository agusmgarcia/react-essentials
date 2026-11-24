import { describe, expect, it } from "vitest";

import isSSR from "./isSSR";

describe("isSSR", () => {
  it("should return true when window is not defined", () => {
    expect(isSSR()).toBe(true);
  });
});
