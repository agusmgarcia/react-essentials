type RecursiveTupleOf<
  TType,
  TLength extends number,
  TRest extends unknown[],
> = TRest["length"] extends TLength
  ? TRest
  : RecursiveTupleOf<TType, TLength, [TType, ...TRest]>;

/**
 * A recursive utility type that generates a tuple of a specified length (`TLength`)
 * where each element is of the specified type (`TType`).
 *
 * @template TType - The type of each element in the resulting tuple.
 * @template TLength - The desired length of the tuple.
 * @template TRest - An internal accumulator used during recursion to build the tuple.
 *
 * @remarks
 * This type uses recursion to construct the tuple by repeatedly prepending `TType`
 * to the `TRest` array until the length of `TRest` matches `TLength`.
 */
type Tuple<TType, TLength extends number> = TLength extends TLength
  ? number extends TLength
    ? TType[]
    : RecursiveTupleOf<TType, TLength, []>
  : never;

export default Tuple;
