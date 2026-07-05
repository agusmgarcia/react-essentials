import { useEffect, useRef } from "react";

import { type Input, type Output } from "./useSynchronizedRef.types";

/**
 * A React hook that maintains a ref object always synchronized with the latest
 * value. Unlike a plain `useRef`, this hook updates `ref.current` on every
 * render cycle via an effect, ensuring the ref always reflects the most recent
 * value without triggering re-renders.
 *
 * This is useful for accessing the latest value inside callbacks, event
 * handlers, or effects without needing to include the value in dependency
 * arrays.
 *
 * @template TValue - The type of the value to persist.
 * @param value - The value to keep in sync with the ref.
 * @returns A `RefObject` whose `.current` property always holds the latest value.
 */
export default function useSynchronizedRef<TValue>(
  value: Input<TValue>,
): Output<TValue> {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
