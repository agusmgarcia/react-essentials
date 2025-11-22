import { type Func } from "../types";

export function distinct<TElement>(
  element: TElement,
  index: number,
  array: ReadonlyArray<TElement>,
): boolean;

export function distinct<TElement>(
  compare: Func<boolean, [element1: TElement, element2: TElement]>,
): Func<
  boolean,
  [element: TElement, index: number, array: ReadonlyArray<TElement>]
>;

export function distinct<TElement>(
  elementOrCompare:
    | TElement
    | Func<boolean, [element1: TElement, element2: TElement]>,
  index?: number,
  array?: ReadonlyArray<TElement>,
):
  | boolean
  | Func<
      boolean,
      [element: TElement, index: number, array: ReadonlyArray<TElement>]
    > {
  if (typeof index === "number" && !!array)
    return array.indexOf(elementOrCompare as TElement) === index;

  return (element1, index, array) =>
    array.findIndex(
      (element2) =>
        element1 === element2 ||
        (typeof elementOrCompare === "function"
          ? (
              elementOrCompare as Func<
                boolean,
                [element1: TElement, element2: TElement]
              >
            )(element1, element2)
          : false),
    ) === index;
}

export function paginate<TElement>(
  pageIndex: number,
  pageSize: number,
): Func<
  boolean,
  [element: TElement, index: number, array: ReadonlyArray<TElement>]
> {
  return (_element, index, _array) =>
    index >= pageSize * (pageIndex - 1) && index < pageSize * pageIndex;
}
