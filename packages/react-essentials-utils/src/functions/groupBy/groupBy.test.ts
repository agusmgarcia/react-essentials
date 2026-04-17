import groupBy from "./groupBy";

describe("groupBy", () => {
  it("groups numbers by even or odd", () => {
    const input = [1, 2, 3, 4, 5];
    const result = groupBy(input, (n) => (n % 2 === 0 ? "even" : "odd"));
    expect(result).toEqual([
      { key: "odd", values: [1, 3, 5] },
      { key: "even", values: [2, 4] },
    ]);
  });

  it("groups objects by property", () => {
    const input = [
      { id: 1, type: "a" },
      { id: 2, type: "b" },
      { id: 3, type: "a" },
    ];
    const result = groupBy(input, (item) => item.type);
    expect(result).toEqual([
      {
        key: "a",
        values: [
          { id: 1, type: "a" },
          { id: 3, type: "a" },
        ],
      },
      { key: "b", values: [{ id: 2, type: "b" }] },
    ]);
  });

  it("returns empty array when input is empty", () => {
    const result = groupBy([], () => "any");
    expect(result).toEqual([]);
  });

  it("handles grouping by number keys", () => {
    const input = [
      { group: 10, id: 1 },
      { group: 20, id: 2 },
      { group: 10, id: 3 },
    ];
    const result = groupBy(input, (item) => item.group);
    expect(result).toEqual([
      {
        key: 10,
        values: [
          { group: 10, id: 1 },
          { group: 10, id: 3 },
        ],
      },
      { key: 20, values: [{ group: 20, id: 2 }] },
    ]);
  });

  it("handles all items in one group", () => {
    const input = [1, 2, 3];
    const result = groupBy(input, () => "all");
    expect(result).toEqual([{ key: "all", values: [1, 2, 3] }]);
  });

  it("handles each item in its own group", () => {
    const input = ["a", "b", "c"];
    const result = groupBy(input, (x) => x);
    expect(result).toEqual([
      { key: "a", values: ["a"] },
      { key: "b", values: ["b"] },
      { key: "c", values: ["c"] },
    ]);
  });

  it("preserves group order as first encountered", () => {
    const input = ["x", "y", "x", "z", "y"];
    const result = groupBy(input, (x) => x);
    expect(result).toEqual([
      { key: "x", values: ["x", "x"] },
      { key: "y", values: ["y", "y"] },
      { key: "z", values: ["z"] },
    ]);
  });
});
