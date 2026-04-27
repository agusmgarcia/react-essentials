import { type Func } from "#src/types";

import { type NestedPaths } from "./properties.types";

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
): element is Record<TProperty, unknown>;

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "boolean",
): element is Record<TProperty, boolean>;

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "function",
): element is Record<TProperty, Func<any, [...any[]]>>;

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "null",
): element is Record<TProperty, null>;

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "number",
): element is Record<TProperty, number>;

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "object",
): element is Record<TProperty, Record<string, unknown>>;

export function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "string",
): element is Record<TProperty, string>;

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

export function sort<TElement>(
  input: TElement,
  preferred: NestedPaths<TElement>[] = [],
  omit: NestedPaths<TElement>[] = [],
): TElement {
  return recursiveSort(input, preferred, omit, "");
}

export function recursiveSort<TElement>(
  input: TElement,
  preferred: NestedPaths<TElement>[],
  omit: NestedPaths<TElement>[],
  base: string,
): TElement {
  if (typeof input !== "object" || !input) return input;

  const baseParts = base
    .replace(/\.$/, "")
    .split(".")
    .filter((b) => !!b);

  const skipSort = omit.some((omitPath) => {
    const omitParts = omitPath.split(".");

    if (omitParts.length !== baseParts.length) return false;

    return omitParts.every(
      (omitPart, index) => omitPart === "*" || omitPart === baseParts[index],
    );
  });

  const keys = Array.isArray(input)
    ? input.map((_, index) => `${index}`)
    : Object.keys(input);

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
    .map((p) => {
      const exactKey = keys.find((key) => key === p);
      if (exactKey) return exactKey;

      const nestedKey = keys.find((key) => p.startsWith(`${key}.`));
      if (nestedKey) return nestedKey;

      return p.split(".", 1)[0];
    })
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
    return (skipSort ? input : input.sort(sortKeys)).map((value, index) =>
      recursiveSort(value, preferred, omit, `${base}${index}.`),
    ) as TElement;

  return (
    skipSort ? Object.keys(input) : Object.keys(input).sort(sortKeys)
  ).reduce((result, key) => {
    (result as any)[key] = recursiveSort(
      (input as any)[key],
      preferred as any,
      omit,
      `${base}${key.replace(/\./g, "@@@@")}.`,
    );
    return result;
  }, {} as TElement);
}
