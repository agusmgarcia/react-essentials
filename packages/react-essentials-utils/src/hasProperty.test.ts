import hasProperty from "./hasProperty";

describe("hasProperty", () => {
  it("returns true if property exists (no type check)", () => {
    expect(hasProperty({ foo: 123 }, "foo")).toBe(true);
    expect(hasProperty({ bar: undefined }, "bar")).toBe(true);
    expect(hasProperty({ baz: null }, "baz")).toBe(true);
  });

  it("returns false if property does not exist", () => {
    expect(hasProperty({ foo: 123 }, "bar")).toBe(false);
    expect(hasProperty({}, "baz")).toBe(false);
    expect(hasProperty(null, "foo")).toBe(false);
    expect(hasProperty(undefined, "foo")).toBe(false);
  });

  it("returns true if property exists and matches type 'string'", () => {
    expect(hasProperty({ foo: "bar" }, "foo", "string")).toBe(true);
  });

  it("returns false if property exists but does not match type 'string'", () => {
    expect(hasProperty({ foo: 123 }, "foo", "string")).toBe(false);
    expect(hasProperty({ foo: null }, "foo", "string")).toBe(false);
  });

  it("returns true if property exists and matches type 'number'", () => {
    expect(hasProperty({ foo: 42 }, "foo", "number")).toBe(true);
  });

  it("returns false if property exists but does not match type 'number'", () => {
    expect(hasProperty({ foo: "bar" }, "foo", "number")).toBe(false);
    expect(hasProperty({ foo: null }, "foo", "number")).toBe(false);
  });

  it("returns true if property exists and matches type 'boolean'", () => {
    expect(hasProperty({ foo: true }, "foo", "boolean")).toBe(true);
    expect(hasProperty({ foo: false }, "foo", "boolean")).toBe(true);
  });

  it("returns false if property exists but does not match type 'boolean'", () => {
    expect(hasProperty({ foo: 0 }, "foo", "boolean")).toBe(false);
    expect(hasProperty({ foo: "true" }, "foo", "boolean")).toBe(false);
  });

  it("returns true if property exists and matches type 'function'", () => {
    expect(hasProperty({ foo: () => {} }, "foo", "function")).toBe(true);
    expect(hasProperty({ foo: function () {} }, "foo", "function")).toBe(true);
  });

  it("returns false if property exists but does not match type 'function'", () => {
    expect(hasProperty({ foo: 123 }, "foo", "function")).toBe(false);
    expect(hasProperty({ foo: null }, "foo", "function")).toBe(false);
  });

  it("returns true if property exists and matches type 'undefined'", () => {
    expect(hasProperty({ foo: undefined }, "foo", "undefined")).toBe(true);
  });

  it("returns false if property exists but does not match type 'undefined'", () => {
    expect(hasProperty({ foo: 0 }, "foo", "undefined")).toBe(false);
    expect(hasProperty({ foo: null }, "foo", "undefined")).toBe(false);
  });

  it("returns true if property exists and matches type 'null'", () => {
    expect(hasProperty({ foo: null }, "foo", "null")).toBe(true);
  });

  it("works with objects created with Object.create(null)", () => {
    const obj = Object.create(null);
    obj.foo = "bar";
    expect(hasProperty(obj, "foo")).toBe(true);
    expect(hasProperty(obj, "foo", "string")).toBe(true);
    expect(hasProperty(obj, "foo", "number")).toBe(false);
  });

  it("returns false for non-object element", () => {
    expect(hasProperty(123 as any, "foo")).toBe(false);
    expect(hasProperty("bar" as any, "foo")).toBe(false);
    expect(hasProperty(true as any, "foo")).toBe(false);
  });
});
