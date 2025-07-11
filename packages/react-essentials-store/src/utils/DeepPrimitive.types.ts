import type Primitive from "./Primitive.types";

type DeepPrimitive =
  | Primitive
  | ReadonlyArray<DeepPrimitive>
  | ReadonlyMap<DeepPrimitive, DeepPrimitive>
  | ReadonlySet<DeepPrimitive>
  | { [key: string | number | symbol]: DeepPrimitive };

export default DeepPrimitive;
