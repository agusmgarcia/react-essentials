import type Func from "./Func.types";

/**
 * Checks if the given `element` has a property named `property`.
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @returns `true` if the property exists on the object otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
): element is Record<TProperty, unknown>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "boolean",
): element is Record<TProperty, boolean>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "function",
): element is Record<TProperty, Func<any, [...any[]]>>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "null",
): element is Record<TProperty, null>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "number",
): element is Record<TProperty, number>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "object",
): element is Record<TProperty, Record<string, unknown>>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "string",
): element is Record<TProperty, string>;

/**
 * Checks if the given `element` has a property named `property` and matches the given type..
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @param type - The expected JavaScript type of the property value.
 * @returns `true` if the property exists on the object and matches the type if specified, otherwise `false`.
 */
export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "undefined",
): element is Record<TProperty, undefined>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type?:
    | "boolean"
    | "function"
    | "null"
    | "number"
    | "object"
    | "string"
    | "undefined",
): element is Record<TProperty, unknown> {
  if (typeof element !== "object") return false;
  if (!element) return false;
  if (!(property in element)) return false;

  const isNull = type === "null";
  type = type === "null" ? "object" : type;

  if (!!type && typeof (element as any)[property] !== type) return false;
  if (isNull && !!(element as any)[property]) return false;

  return true;
}
