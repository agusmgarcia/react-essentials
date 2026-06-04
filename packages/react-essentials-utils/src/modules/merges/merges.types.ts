import { type Func } from "#src/types";

/**
 * A custom comparator function for arrays.
 */
export type ArrayComparatorFn = Func<boolean, [element1: any, element2: any]>;
