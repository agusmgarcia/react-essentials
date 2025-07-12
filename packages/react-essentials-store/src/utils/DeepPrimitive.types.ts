import type Primitive from "./Primitive.types";

type DeepPrimitive =
  | Primitive
  | ReadonlyArray<DeepPrimitive>
  | { [key: string | number | symbol]: DeepPrimitive };

export default DeepPrimitive;
