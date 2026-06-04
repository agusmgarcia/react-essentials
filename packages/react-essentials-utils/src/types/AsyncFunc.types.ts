/**
 * Represents an asynchronous function type.
 *
 * @param args - The arguments passed to the function.
 * @returns A Promise that resolves to a value of type `TResult`.
 */
type AsyncFunc<TResult = void, TArgs extends any[] = []> = (
  ...args: TArgs
) => Promise<TResult>;

export default AsyncFunc;
