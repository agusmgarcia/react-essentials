/**
 * An object containing key-value pairs where the key corresponds to the
 * placeholder name and the value is the replacement. The value can be of
 * type string, number, boolean, or undefined.
 */
export type Replacements = Record<
  string,
  string | number | boolean | undefined
>;
