import type DeepPrimitive from "./DeepPrimitive.types";
import type Primitive from "./Primitive.types";

type Const<TState extends DeepPrimitive> = TState extends Primitive
  ? TState
  : TState extends ReadonlyArray<infer TValue>
    ? TValue extends DeepPrimitive
      ? ReadonlyArray<Const<TValue>>
      : never
    : TState extends Record<any, any>
      ? { readonly [TKey in keyof TState]: Const<TState[TKey]> }
      : never;

export default Const;
