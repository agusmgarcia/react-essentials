import isMethodOverridden from "./isMethodOverridden";

class BaseClass {
  method() {
    return "base";
  }
}

class SubClass extends BaseClass {
  override method() {
    return "sub";
  }
}

class AnotherSubClass extends SubClass {}

describe("isMethodOverridden", () => {
  it("should return undefined if the method is not overridden", () => {
    const instance = new BaseClass();
    const result = isMethodOverridden(instance, Object.prototype, "method");
    expect(result).toBeUndefined();
  });

  it("should return the prototype where the method is last overridden", () => {
    const instance = new SubClass();
    const result = isMethodOverridden(instance, Object.prototype, "method");
    expect(result).toBe(SubClass.prototype);
  });

  it("should return undefined if the method is overridden only once in the hierarchy", () => {
    const instance = new AnotherSubClass();
    const result = isMethodOverridden(instance, Object.prototype, "method");
    expect(result).toBe(SubClass.prototype);
  });

  it("should return undefined if the method does not exist in the hierarchy", () => {
    const instance = new SubClass();
    const result = isMethodOverridden(
      instance,
      Object.prototype,
      "nonExistentMethod",
    );
    expect(result).toBeUndefined();
  });

  it("should stop searching at the specified base prototype", () => {
    const instance = new SubClass();
    const result = isMethodOverridden(instance, BaseClass.prototype, "method");
    expect(result).toBeUndefined();
  });

  it("should handle objects with no prototype", () => {
    const instance = Object.create(null);
    const result = isMethodOverridden(instance, Object.prototype, "method");
    expect(result).toBeUndefined();
  });
});
