import * as strings from "./strings";

describe("strings", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a lowercase string", () => {
      expect(strings.capitalize("hello")).toBe("Hello");
    });

    it("should not change the first letter if it is already capitalized", () => {
      expect(strings.capitalize("World")).toBe("World");
    });

    it("should handle single-character strings", () => {
      expect(strings.capitalize("a")).toBe("A");
      expect(strings.capitalize("B")).toBe("B");
    });

    it("should return an empty string if input is an empty string", () => {
      expect(strings.capitalize("")).toBe("");
    });

    it("should handle strings with special characters", () => {
      expect(strings.capitalize("!hello")).toBe("!hello");
      expect(strings.capitalize("123abc")).toBe("123abc");
    });

    it("should handle strings with spaces", () => {
      expect(strings.capitalize(" hello")).toBe(" hello");
      expect(strings.capitalize(" world")).toBe(" world");
    });
  });

  describe("replace", () => {
    it("should replace single placeholders with corresponding values", () => {
      const result = strings.replace("Hello, ${name}!", { name: "John" });
      expect(result).toBe("Hello, John!");
    });

    it("should replace multiple placeholders with corresponding values", () => {
      const result = strings.replace(
        "Hello, ${name}! You are ${age} years old.",
        {
          age: 30,
          name: "John",
        },
      );
      expect(result).toBe("Hello, John! You are 30 years old.");
    });

    it("should handle conditional replacements when the value matches", () => {
      const result = strings.replace("You have ${count?one item:many items}.", {
        count: 1,
      });
      expect(result).toBe("You have one item.");
    });

    it("should handle conditional replacements when the value does not match", () => {
      const result = strings.replace("You have ${count?one item:many items}.", {
        count: 2,
      });
      expect(result).toBe("You have many items.");
    });

    it("should return the original string if no replacements are provided", () => {
      const result = strings.replace("Hello, ${name}!");
      expect(result).toBe("Hello, ${name}!");
    });

    it("should return the original string if the key does not exist in replacements", () => {
      const result = strings.replace("Hello, ${name}!", { age: 30 });
      expect(result).toBe("Hello, ${name}!");
    });

    it("should handle boolean replacements", () => {
      const result = strings.replace("Feature enabled: ${enabled}", {
        enabled: true,
      });
      expect(result).toBe("Feature enabled: true");
    });

    it("should handle undefined message", () => {
      const result = strings.replace(undefined, { name: "John" });
      expect(result).toBeUndefined();
    });

    it("should handle undefined replacements", () => {
      const result = strings.replace("Hello, ${name}!", undefined);
      expect(result).toBe("Hello, ${name}!");
    });

    it("should handle numeric replacements", () => {
      const result = strings.replace("Your score is ${score}.", {
        score: 100,
      });
      expect(result).toBe("Your score is 100.");
    });

    it("should not replace if the conditional key is not a number", () => {
      const result = strings.replace("You have ${count?one item:many items}.", {
        count: "not a number",
      });
      expect(result).toBe("You have ${count?one item:many items}.");
    });
  });
});
