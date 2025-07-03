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
 *
 * @example
 * ```typescript
 * const obj = { b: 2, a: { y: 2, x: 1 }, c: 3 };
 * const sorted = sortProperties(obj, ['a', 'b', 'c', 'a.x', 'a.y']);
 * // sorted: { a: { x: 1, y: 2 }, b: 2, c: 3 }
 * ```
 */
export default function sortProperties<TElement>(
  input: TElement,
  preferred: NestedPaths<TElement>[] = [],
): TElement {
  return recursiveSortProperties(input, preferred, "");
}

function recursiveSortProperties<TElement>(
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
        recursiveSortProperties(value, preferred, `${base}${index}.`),
      ) as TElement;

  return Object.keys(input)
    .sort(sortKeys)
    .reduce((result, key) => {
      result[key as keyof TElement] = recursiveSortProperties(
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
