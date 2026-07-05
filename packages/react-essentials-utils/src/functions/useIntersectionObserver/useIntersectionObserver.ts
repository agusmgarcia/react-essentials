import { useEffect, useRef, useState } from "react";

import { type Input, type Output } from "./useIntersectionObserver.types";

/**
 * A React hook that observes when an element enters or exits the viewport
 * using the browser's `IntersectionObserver` API.
 *
 * It returns a ref callback that should be assigned to the element you want to
 * observe. The hook fires `onEnterViewport` when the element becomes visible
 * and optionally fires `onExitViewport` when it leaves. Each callback fires
 * only once per enter/exit cycle (i.e., it won't fire repeatedly while the
 * element remains in or out of view).
 *
 * @param options - Configuration object.
 * @returns A ref callback to attach to the DOM element to observe.
 */
export default function useIntersectionObserver({
  onEnterViewport,
  onExitViewport,
  threshold = 0,
}: Input): Output {
  const [element, setElement] = useState<Element | null>(null);
  const eventFired = useRef(false);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !eventFired.current) {
          onEnterViewport();
          eventFired.current = true;
        } else if (!entry.isIntersecting && eventFired.current) {
          onExitViewport?.();
          eventFired.current = false;
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      eventFired.current = false;
    };
  }, [element, onEnterViewport, onExitViewport, threshold]);

  return setElement;
}
