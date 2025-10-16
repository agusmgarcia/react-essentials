export type NestedPaths<TElement> = TElement extends (...args: any) => any
  ? never
  : TElement extends Array<infer TElementArray>
    ? `*.${NestedPaths<TElementArray>}`
    : TElement extends object
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
