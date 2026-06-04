/**
 * A generic type representing a function with a customizable return type and arguments.
 */
type Func<TResult = void, TArgs extends any[] = []> = (
  ...args: TArgs
) => TResult;

export default Func;
