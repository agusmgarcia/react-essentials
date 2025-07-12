import type Primitive from "./Primitive.types";

type DeepPrimitive =
  | Primitive
  | ReadonlyArray<DeepPrimitive>
  | { [key: string | number]: DeepPrimitive };

export default DeepPrimitive;
