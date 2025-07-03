import type Func from "./Func.types";

/**
 * Checks if the given `element` has a property named `property`.
 *
 * @typeParam TProperty - The name of the property to check for.
 * @param element - The object to check.
 * @param property - The property name to look for on the object.
 * @returns `true` if the property exists on the object otherwise `false`.
 */
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
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
export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "undefined",
): element is Record<TProperty, undefined>;

export function has<TProperty extends string>(
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

/**
 * Sorts the properties of an object or array according to a preferred order of nested property paths.
 *
 * @template TElement - The type of the input object or array.
 * @param input - The object or array whose properties should be sorted.
 * @param preferred - An optional array of nested property paths (as strings) that defines the preferred order of properties.
 *                    Paths can use dot notation for nesting and `*` as a wildcard for arrays.
 * @param base - An internal parameter used for recursion to track the current property path (default is an empty string).
 * @returns A new object or array with properties sorted according to the preferred order, recursively applied to nested objects/arrays.
 *
 * @remarks
 * - If a property is not listed in `preferred`, it will be sorted alphabetically after the preferred properties.
 * - The function is recursive and will sort nested objects and arrays according to the relevant subset of `preferred` paths.
 * - The `NestedPaths<TElement>` type is used to infer all possible nested property paths for the given input type.
 */
export function sort<TElement>(
  input: TElement,
  preferred: NestedPaths<TElement>[] = [],
): TElement {
  return recursiveSort(input, preferred, "");
}

function recursiveSort<TElement>(
  input: TElement,
  preferred: NestedPaths<TElement>[],
  base: string,
): TElement {
  if (typeof input !== "object" || !input) return input;

  const baseParts = base.split(".").filter((b) => !!b);
  const scopePreferred = preferred
    .map((p) => {
      const pParts = p.split(".");

      if (pParts.length <= baseParts.length) return p;

      for (let i = 0; i < baseParts.length; i++) {
        if (pParts[i] === "*") pParts[i] = baseParts[i];
        else if (pParts[i] !== baseParts[i]) return p;
      }

      return pParts.join(".");
    })
    .filter((p) => p.startsWith(base))
    .map((p) => p.replace(base, ""))
    .map((p) => p.split(".", 1)[0])
    .filter((p) => !!p);

  function sortKeys(key1: string, key2: string): number {
    const indexOfKey1 = scopePreferred.indexOf(key1);
    const indexOfKey2 = scopePreferred.indexOf(key2);

    if (indexOfKey1 === -1 && indexOfKey2 === -1)
      return +(key1 > key2) || -(key2 > key1);

    if (indexOfKey1 === -1) return 1;
    if (indexOfKey2 === -1) return -1;

    return indexOfKey1 - indexOfKey2;
  }

  if (Array.isArray(input))
    return input
      .sort(sortKeys)
      .map((value, index) =>
        recursiveSort(value, preferred, `${base}${index}.`),
      ) as TElement;

  return Object.keys(input)
    .sort(sortKeys)
    .reduce((result, key) => {
      result[key as keyof TElement] = recursiveSort(
        input[key as keyof TElement],
        preferred as any,
        `${base}${key.replace(/\./g, "@@@@")}.`,
      );
      return result;
    }, {} as TElement);
}

type NestedPaths<TElement> = TElement extends Function
  ? never
  : TElement extends Array<infer TElementArray>
    ? `*.${NestedPaths<TElementArray>}`
    : TElement extends Record<string, any>
      ? {
          [TProperty in keyof TElement]: TProperty extends string
            ?
                | TProperty
                | (NestedPaths<TElement[TProperty]> extends infer TNestedPaths
                    ? TNestedPaths extends string
                      ? `${TProperty}.${TNestedPaths}` | `*.${TNestedPaths}`
                      : never
                    : never)
            : never;
        }[keyof TElement]
      : never;
