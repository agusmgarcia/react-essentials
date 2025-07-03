import * as equals from "./equals";
import * as filters from "./filters";
import type Func from "./Func.types";

/**
 * Merges two objects or arrays strictly, ensuring deep equality checks.
 *
 * @param base - The base object or array to merge into.
 * @param next - The next object or array to merge from.
 * @returns The merged result.
 */
export function strict(base: unknown, next: unknown): any {
  return merge(base, next, 0, equals.deep);
}

/**
 * Merges two objects or arrays shallowly, with configurable options.
 *
 * @param base - The base object or array to merge into.
 * @param next - The next object or array to merge from.
 * @param options - The merge options, which can be:
 *   - A number representing the depth level for merging.
 *   - An object with optional properties:
 *     - `array.comparator`: A custom comparator function for arrays.
 *     - `level`: The depth level for merging.
 * @returns The merged result.
 */
export function shallow(
  base: unknown,
  next: unknown,
  options:
    | number
    | {
        array?: { comparator?: ArrayComparatorFn };
        level?: number;
      } = 1,
): any {
  return merge(
    base,
    next,
    typeof options === "number"
      ? options
      : typeof options.level === "number"
        ? options.level
        : 1,
    typeof options === "number"
      ? equals.deep
      : options.array?.comparator || equals.deep,
  );
}

/**
 * Merges two objects or arrays deeply, with configurable options.
 *
 * @param base - The base object or array to merge into.
 * @param next - The next object or array to merge from.
 * @param options - Optional merge options:
 *   - `array.comparator`: A custom comparator function for arrays.
 * @returns The merged result.
 */
export function deep(
  base: unknown,
  next: unknown,
  options?: {
    array?: { comparator?: ArrayComparatorFn };
  },
): any {
  return merge(
    base,
    next,
    undefined,
    options?.array?.comparator || equals.deep,
  );
}

function merge(
  base: any,
  next: any,
  level: number | undefined,
  arrayComparator: ArrayComparatorFn,
): any {
  if (!!level && level < 0) return next;
  if (typeof level === "number" && !level) return next;
  if (base === next) return next;

  const followingLevel = !!level ? level - 1 : undefined;

  if (Array.isArray(next)) {
    if (!Array.isArray(base)) base = [];

    return [...base, ...next]
      .filter(filters.distinct(arrayComparator))
      .map((baseValue) => {
        const index = next.findIndex((nextValue) =>
          arrayComparator(baseValue, nextValue),
        );

        return index !== -1
          ? merge(baseValue, next[index], followingLevel, arrayComparator)
          : merge(undefined, baseValue, followingLevel, arrayComparator);
      });
  }

  if (typeof next === "object" && !!next) {
    if (Array.isArray(base) || typeof base !== "object" || !base) base = {};

    return [...Object.keys(base), ...Object.keys(next)]
      .filter(filters.distinct)
      .reduce(
        (result, key) => {
          result[key] =
            key in next
              ? merge(base[key], next[key], followingLevel, arrayComparator)
              : merge(undefined, base[key], followingLevel, arrayComparator);

          return result;
        },
        {} as Record<string, any>,
      );
  }

  return next;
}

type ArrayComparatorFn = Func<boolean, [element1: any, element2: any]>;
