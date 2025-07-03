import type AsyncFunc from "./AsyncFunc.types";
import type Func from "./Func.types";
import * as properties from "./properties";

/**
 * Throws an error and terminates the execution of the current function.
 *
 * @param error - The error object to be thrown.
 * @throws The provided error object.
 * @returns This function never returns as it always throws an error.
 */
export function emit(error: Error): never;

/**
 * Throws an error with the provided message and options.
 *
 * @param message - The error message to be thrown.
 * @param options - Optional error options.
 * @throws An Error object with the provided message and options.
 * @returns This function never returns as it always throws an error.
 */
export function emit(message: string, options?: ErrorOptions): never;

export function emit(
  errorOrMessage: Error | string,
  options?: ErrorOptions,
): never {
  if (typeof errorOrMessage === "string")
    throw new Error(errorOrMessage, options);

  throw errorOrMessage;
}

/**
 * Retrieves the message from an error object.
 *
 * @param error - The error to extract the message from. Can be of any type.
 * @returns The extracted error message as a string, or a default message if none is found.
 */
export function getMessage(error: unknown): string;

/**
 * Retrieves the message from an error object.
 *
 * @param error - The error to extract the message from. Can be of any type.
 * @param notFound - The fallback message to return if no message is found.
 * @returns The extracted error message as a string, the provided `notFound` message, or a default message if none is found.
 */
export function getMessage(error: unknown, notFound: string): string;

export function getMessage(error: unknown, notFound?: string): string {
  if (typeof error === "string") return error;
  if (properties.has(error, "message", "string")) return error.message;
  return notFound || "An unexpected error occurred";
}

/**
 * Executes a synchronous function and catches any errors that occur.
 *
 * If the `callback` function throws an error the `catchCallback` function is called with the error.
 *
 * @typeParam TResult - The return type of the `callback` function.
 * @typeParam TResultCatch - The return type of the `catchCallback` function.
 *
 * @param callback - The function to execute.
 * @param catchCallback - The function to execute if an error is thrown. Receives the error as its argument.
 *
 * @returns The result of `callback`, or the result of `catchCallback` if an error occurs.
 */
export function handle<TResult, TResultCatch>(
  callback: Func<TResult>,
  catchCallback: Func<TResultCatch, [error: unknown]>,
): TResult | TResultCatch;

/**
 * Executes an asynchronous function and catches any errors that occur.
 *
 * If the `callback` function returns a rejected promise the `catchCallback` function is called with the error.
 *
 * @typeParam TResult - The return type of the `callback` function.
 * @typeParam TResultCatch - The return type of the `catchCallback` function.
 *
 * @param callback - The function to execute.
 * @param catchCallback - The function to execute if a promise is rejected. Receives the error as its argument.
 *
 * @returns The result of `callback`, or the result of `catchCallback` if an error occurs.
 */
export function handle<TResult, TResultCatch>(
  callback: AsyncFunc<TResult>,
  catchCallback: Func<TResultCatch, [error: unknown]>,
): Promise<TResult | TResultCatch>;

export function handle<TResult, TResultCatch>(
  callback: Func<TResult> | AsyncFunc<TResult>,
  catchCallback: Func<TResultCatch, [error: unknown]>,
): TResult | TResultCatch | Promise<TResult | TResultCatch> {
  try {
    const result = callback();
    if (!(result instanceof Promise)) return result;
    return result.catch(catchCallback);
  } catch (error) {
    return catchCallback(error);
  }
}
