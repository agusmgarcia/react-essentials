import * as properties from "./properties";

describe("properties", () => {
  describe("has", () => {
    it("returns true if property exists (no type check)", () => {
      expect(properties.has({ foo: 123 }, "foo")).toBe(true);
      expect(properties.has({ bar: undefined }, "bar")).toBe(true);
      expect(properties.has({ baz: null }, "baz")).toBe(true);
    });

    it("returns false if property does not exist", () => {
      expect(properties.has({ foo: 123 }, "bar")).toBe(false);
      expect(properties.has({}, "baz")).toBe(false);
      expect(properties.has(null, "foo")).toBe(false);
      expect(properties.has(undefined, "foo")).toBe(false);
    });

    it("returns true if property exists and matches type 'string'", () => {
      expect(properties.has({ foo: "bar" }, "foo", "string")).toBe(true);
    });

    it("returns false if property exists but does not match type 'string'", () => {
      expect(properties.has({ foo: 123 }, "foo", "string")).toBe(false);
      expect(properties.has({ foo: null }, "foo", "string")).toBe(false);
    });

    it("returns true if property exists and matches type 'number'", () => {
      expect(properties.has({ foo: 42 }, "foo", "number")).toBe(true);
    });

    it("returns false if property exists but does not match type 'number'", () => {
      expect(properties.has({ foo: "bar" }, "foo", "number")).toBe(false);
      expect(properties.has({ foo: null }, "foo", "number")).toBe(false);
    });

    it("returns true if property exists and matches type 'boolean'", () => {
      expect(properties.has({ foo: true }, "foo", "boolean")).toBe(true);
      expect(properties.has({ foo: false }, "foo", "boolean")).toBe(true);
    });

    it("returns false if property exists but does not match type 'boolean'", () => {
      expect(properties.has({ foo: 0 }, "foo", "boolean")).toBe(false);
      expect(properties.has({ foo: "true" }, "foo", "boolean")).toBe(false);
    });

    it("returns true if property exists and matches type 'function'", () => {
      expect(properties.has({ foo: () => {} }, "foo", "function")).toBe(true);
      expect(properties.has({ foo: function () {} }, "foo", "function")).toBe(
        true,
      );
    });

    it("returns false if property exists but does not match type 'function'", () => {
      expect(properties.has({ foo: 123 }, "foo", "function")).toBe(false);
      expect(properties.has({ foo: null }, "foo", "function")).toBe(false);
    });

    it("returns true if property exists and matches type 'undefined'", () => {
      expect(properties.has({ foo: undefined }, "foo", "undefined")).toBe(true);
    });

    it("returns false if property exists but does not match type 'undefined'", () => {
      expect(properties.has({ foo: 0 }, "foo", "undefined")).toBe(false);
      expect(properties.has({ foo: null }, "foo", "undefined")).toBe(false);
    });

    it("returns true if property exists and matches type 'null'", () => {
      expect(properties.has({ foo: null }, "foo", "null")).toBe(true);
    });

    it("works with objects created with Object.create(null)", () => {
      const obj = Object.create(null);
      obj.foo = "bar";
      expect(properties.has(obj, "foo")).toBe(true);
      expect(properties.has(obj, "foo", "string")).toBe(true);
      expect(properties.has(obj, "foo", "number")).toBe(false);
    });

    it("returns false for non-object element", () => {
      expect(properties.has(123 as any, "foo")).toBe(false);
      expect(properties.has("bar" as any, "foo")).toBe(false);
      expect(properties.has(true as any, "foo")).toBe(false);
    });
  });

  describe("sort", () => {
    it("sorts object properties according to preferred order", () => {
      const input = { a: 1, b: 2, c: 3 };
      const result = properties.sort(input, ["a", "b"]);
      expect(Object.keys(result)).toEqual(["a", "b", "c"]);
    });

    it("sorts nested object properties according to preferred order", () => {
      const input = { bar: 3, foo: { x: 1, y: 2 } };
      const result = properties.sort(input, ["foo.x", "foo.y", "bar"]);
      expect(Object.keys(result)).toEqual(["foo", "bar"]);
      expect(Object.keys(result.foo)).toEqual(["x", "y"]);
    });

    it("sorts array of objects using wildcard in preferred order", () => {
      const input = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ];
      const result = properties.sort(input, ["*.a", "*.b"]);
      expect(Object.keys(result[0])).toEqual(["a", "b"]);
      expect(Object.keys(result[1])).toEqual(["a", "b"]);
    });

    it("sorts deeply nested objects and arrays", () => {
      const input = {
        arr: [
          { bar: 3, foo: { x: 1, y: 2 } },
          { bar: 5, foo: { x: 3, y: 4 } },
        ],
      };
      const result = properties.sort(input, [
        "arr.*.foo.x",
        "arr.*.foo.y",
        "arr.*.bar",
      ]);
      expect(Object.keys(result.arr[0].foo)).toEqual(["x", "y"]);
      expect(Object.keys(result.arr[1].foo)).toEqual(["x", "y"]);
      expect(Object.keys(result.arr[0])).toEqual(["foo", "bar"]);
    });

    it("sorts properties alphabetically if not in preferred", () => {
      const input = { a: 1, b: 2, c: 3 };
      const result = properties.sort(input, []);
      expect(Object.keys(result)).toEqual(["a", "b", "c"]);
    });

    it("handles empty object and array", () => {
      expect(properties.sort<any>({}, ["a", "b"])).toEqual({});
      expect(properties.sort<any>([], ["*.a"])).toEqual([]);
    });

    it("returns primitives as is", () => {
      expect(properties.sort(123 as any, ["a"])).toBe(123);
      expect(properties.sort("foo" as any, ["a"])).toBe("foo");
      expect(properties.sort(null as any, ["a"])).toBe(null);
      expect(properties.sort(undefined as any, ["a"])).toBe(undefined);
    });

    it("does not mutate the original object", () => {
      const input = { a: 1, b: 2 };
      const copy = { ...input };
      properties.sort(input, ["a", "b"]);
      expect(input).toEqual(copy);
    });

    it("sorts keys with dots in their names correctly", () => {
      const input = { a: 2, "a.b": 1 };
      const result = properties.sort(input, ["a", "a.b"]);
      expect(Object.keys(result)).toEqual(["a", "a.b"]);
    });
  });
});
