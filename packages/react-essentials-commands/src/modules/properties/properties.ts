import { type Func } from "#src/types";

import { type NestedPaths } from "./properties.types";

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
): element is Record<TProperty, unknown>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "boolean",
): element is Record<TProperty, boolean>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "function",
): element is Record<TProperty, Func<any, [...any[]]>>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "null",
): element is Record<TProperty, null>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "number",
): element is Record<TProperty, number>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "object",
): element is Record<TProperty, Record<string, unknown>>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "string",
): element is Record<TProperty, string>;

function has<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "undefined",
): element is Record<TProperty, undefined>;

function has<TProperty extends string>(
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

function sort<TElement>(
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

const properties = { has, sort };
export default properties;
