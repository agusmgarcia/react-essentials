import type Primitive from "./Primitive.types";

/**
 * Represents a value that can be serialized, such as for JSON encoding.
 *
 * A `Serializable` value can be:
 * - A primitive type (as defined by `Primitive`)
 * - A readonly array of serializable values
 * - An object with string keys and serializable values
 *
 * This type is useful for defining data structures that need to be safely
 * converted to and from JSON or other serialization formats.
 */
type Serializable =
  | Primitive
  | Array<Serializable>
  | { [key: string]: Serializable };

export default Serializable;
