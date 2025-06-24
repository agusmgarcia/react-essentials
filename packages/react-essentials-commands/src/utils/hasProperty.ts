export default function hasProperty<TProperty extends string>(
  element: unknown,
  property: TProperty,
): element is Record<TProperty, unknown> {
  if (typeof element !== "object") return false;
  if (!element) return false;
  if (!(property in element)) return false;
  return true;
}
