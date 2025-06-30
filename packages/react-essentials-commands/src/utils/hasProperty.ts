import type Func from "./Func.types";

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
): element is Record<TProperty, unknown>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "boolean",
): element is Record<TProperty, boolean>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "function",
): element is Record<TProperty, Func<any, [...any[]]>>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "null",
): element is Record<TProperty, null>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "number",
): element is Record<TProperty, number>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "object",
): element is Record<TProperty, Record<string, unknown>>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "string",
): element is Record<TProperty, string>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type: "undefined",
): element is Record<TProperty, undefined>;

export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
  type?:
    | "boolean"
    | "function"
    | "null"
    | "number"
    | "object"
    | "string"
    | "undefined",
): element is Record<TProperty, unknown> {
  if (typeof element !== "object") return false;
  if (!element) return false;
  if (!(property in element)) return false;

  const isNull = type === "null";
  type = type === "null" ? "object" : type;

  if (!!type && typeof (element as any)[property] !== type) return false;
  if (isNull && !!(element as any)[property]) return false;

  return true;
}
