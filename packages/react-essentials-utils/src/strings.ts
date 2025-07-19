/**
 * Capitalizes the first letter of a given string and returns the modified string.
 *
 * @template TString - A string type that represents the input string.
 * @param string - The input string to be capitalized.
 * @returns The input string with its first letter converted to uppercase.
 *
 * @example
 * ```typescript
 * const result = capitalize("hello");
 * console.log(result); // Output: "Hello"
 * ```
 */
export function capitalize<TString extends string>(
  string: TString,
): Capitalize<TString> {
  return (string.charAt(0).toUpperCase() +
    string.slice(1)) as Capitalize<TString>;
}

const searchValue = /\$\{(.+?)\}/g;
const multipleValues = /^(.+?)\?(.+?)\:(.+?)$/;

type Replacements = Record<string, string | number | boolean | undefined>;

/**
 * Replaces placeholders in a string with corresponding values from a replacements object.
 *
 * Placeholders in the string should be in the format `${key}`. Optionally, conditional placeholders
 * can be used in the format `${key?valueIfTrue:valueIfFalse}`. The conditional placeholders
 * evaluate based on whether the value of `key` in the replacements object is `1`.
 *
 * @param message - The string containing placeholders to be replaced.
 * @param replacements - An object containing key-value pairs where the key corresponds to the
 *                       placeholder name and the value is the replacement. The value can be of
 *                       type string, number, boolean, or undefined.
 * @returns The string with placeholders replaced by their corresponding values from the
 *          replacements object. If the input message is undefined, the function returns undefined.
 */
export function replace(message: string, replacements?: Replacements): string;

/**
 * Replaces placeholders in a string with corresponding values from a replacements object.
 *
 * Placeholders in the string should be in the format `${key}`. Optionally, conditional placeholders
 * can be used in the format `${key?valueIfTrue:valueIfFalse}`. The conditional placeholders
 * evaluate based on whether the value of `key` in the replacements object is `1`.
 *
 * @param message - The string containing placeholders to be replaced. If undefined, the function
 *                  will return undefined.
 * @param replacements - An object containing key-value pairs where the key corresponds to the
 *                       placeholder name and the value is the replacement. The value can be of
 *                       type string, number, boolean, or undefined.
 * @returns The string with placeholders replaced by their corresponding values from the
 *          replacements object. If the input message is undefined, the function returns undefined.
 */
export function replace(
  message: string | undefined,
  replacements?: Replacements,
): string | undefined;

export function replace(
  message: string | undefined,
  replacements?: Replacements,
): string | undefined {
  if (!message) return undefined;

  return message.replace(searchValue, (original, key) => {
    if (multipleValues.test(key)) {
      const matches = multipleValues.exec(key);
      if (!matches) return original;

      const replacer = replacements?.[matches[1]];
      if (typeof replacer !== "number") return original;

      return replacer === 1 ? matches[2] : matches[3];
    }

    const replacer = replacements?.[key];

    if (typeof replacer === "string") return replacer;
    if (typeof replacer === "number") return replacer.toString();
    if (typeof replacer === "boolean") return replacer.toString();

    return original;
  });
}
