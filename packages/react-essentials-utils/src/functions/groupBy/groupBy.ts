import { type Input, type Output } from "./groupBy.types";

export default function groupBy<TElement, TGroupKey extends string | number>(
  ...[array, groupBy]: Input<TElement, TGroupKey>
): Output<TElement, TGroupKey> {
  const result = new Map<TGroupKey, TElement[]>();

  for (const item of array) {
    const group = groupBy(item);
    if (!result.has(group)) result.set(group, []);
    result.get(group)!.push(item);
  }

  return [...result.keys()].map((key) => ({
    key,
    values: result.get(key) || [],
  }));
}
