import { type Func } from "#src/types";

export type Input<TElement, TGroupKey extends string | number> = [
  array: TElement[],
  groupBy: Func<TGroupKey, [item: TElement]>,
];

export type Output<TElement, TGroupKey extends string | number> = {
  key: TGroupKey;
  values: TElement[];
}[];
