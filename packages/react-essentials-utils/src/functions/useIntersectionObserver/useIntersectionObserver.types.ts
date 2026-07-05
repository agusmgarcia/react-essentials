import { type Func } from "#src/types";

/**
 * Configuration object.
 */
export type Input = {
  /**
   * Callback invoked when the element enters the viewport.
   */
  onEnterViewport: Func;
  /**
   * Optional callback invoked when the element exits the viewport.
   */
  onExitViewport?: Func;

  /**
   * A number between 0 and 1 indicating the percentage of the element
   * that must be visible before `onEnterViewport` fires. Defaults to `0`.
   */
  threshold?: number;
};

/**
 * A ref callback to attach to the DOM element to observe.
 */
export type Output = Func<void, [element: Element | null]>;
