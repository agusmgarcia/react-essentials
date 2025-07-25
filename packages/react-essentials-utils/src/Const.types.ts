/**
 * Recursively or shallowly marks all properties of a type as `readonly`.
 *
 * @template TData - The type whose properties will be made readonly.
 * @template TRecursive - Determines the depth of readonly application:
 *   - `"deep"` (default): Recursively applies `readonly` to all nested properties.
 *   - `"shallow"`: Applies `readonly` only to the first level, and strictly to nested properties.
 *   - `"strict"`: Applies `readonly` only to the top-level properties, leaving nested properties mutable.
 */
type Const<TData, TRecursive extends "deep" | "shallow" | "strict" = "deep"> = {
  readonly [TProperty in keyof TData]: TRecursive extends "deep"
    ? Const<TData[TProperty], "deep">
    : TRecursive extends "shallow"
      ? Const<TData[TProperty], "strict">
      : TData[TProperty];
};

export default Const;
