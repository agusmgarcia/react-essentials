import {
  equals,
  type Func,
  isMethodOverridden,
} from "@agusmgarcia/react-essentials-utils";

import { GlobalSlice } from "../GlobalSlice";
import { type BaseResponse, type BaseSlices } from "./ServerSlice.types";

/**
 * Abstract base class for managing server-side state and asynchronous data fetching in a slice-based architecture.
 *
 * @template TResponse - The type of the response data managed by this slice.
 * @template TRequest - The type of the request object used to fetch data.
 * @template TSlices - The type of additional slices that this slice depends on.
 *
 * @extends GlobalSlice
 *
 * @remarks
 * - Handles loading, error, and response state for server requests.
 * - Supports aborting in-flight requests when new requests are made or dependencies change.
 * - Subscribes to dependent slices and reloads data when they change.
 * - Requires implementation of the {@link onFetch} method to perform the actual data fetching.
 */
export default abstract class ServerSlice<
  TResponse extends BaseResponse,
  TRequest = undefined,
  TSlices extends BaseSlices = {},
> extends GlobalSlice<
  { error: unknown; loading: boolean; response: TResponse },
  TSlices
> {
  private static readonly UNINITIALIZED = Symbol("UNINITIALIZED");

  private _request: TRequest | symbol;

  /**
   * Creates a new instance of the ServerSlice.
   *
   * @param initialResponse - The initial response to set in the state. Loading will be set to true.
   *
   * @remarks
   * - Sets the initial state with the provided response.
   * - This constructor is protected and intended to be called by subclasses.
   */
  protected constructor(initialResponse: TResponse) {
    super({ error: undefined, loading: true, response: initialResponse });

    this._request = ServerSlice.UNINITIALIZED;
  }

  override get state(): {
    error: unknown;
    loading: boolean;
    response: TResponse;
  } {
    return super.state;
  }

  /**
   * Gets the current error from the server slice state.
   *
   * @returns The current error, or `undefined` if there is no error.
   *
   * @remarks
   * - This getter provides access to the latest error stored in the slice's state.
   * - The error is updated when a fetch operation fails.
   */
  get error(): unknown {
    return this.state.error;
  }

  /**
   * Sets the error in the server slice state.
   *
   * @param error - The new error to set in the state.
   *
   * @remarks
   * - This setter updates the state with the provided error.
   * - It also sets `loading` to `false`.
   * - Intended to be used by subclasses to update the error after a failed fetch operation.
   */
  protected set error(error: unknown) {
    super.state = { ...this.state, error, loading: false };
  }

  /**
   * Gets the loading state of the server slice.
   *
   * @returns A boolean indicating whether a fetch operation is currently in progress.
   *
   * @remarks
   * - This getter provides access to the loading status stored in the slice's state.
   * - The loading state is set to `true` when a fetch operation starts and `false` when it completes.
   */
  get loading(): boolean {
    return this.state.loading;
  }

  private set loading(loading: boolean) {
    super.state = { ...this.state, loading };
  }

  /**
   * Gets the current response from the server slice state.
   *
   * @returns The current response of type `TResponse`.
   *
   * @remarks
   * - This getter provides access to the latest response stored in the slice's state.
   * - The response is updated when a fetch operation completes successfully.
   */
  get response(): TResponse {
    return this.state.response;
  }

  /**
   * Sets the response in the server slice state.
   *
   * @param response - The new response of type `TResponse` to set in the state.
   *
   * @remarks
   * - This protected setter updates the state with the provided response.
   * - It also resets the error to `undefined` and sets `loading` to `false`.
   * - Intended to be used by subclasses to update the response after a fetch operation.
   */
  protected set response(response: TResponse) {
    super.state = { error: undefined, loading: false, response };
  }

  protected override onInit(signal: AbortSignal): void {
    super.onInit(signal);

    Object.values(this.slices).forEach((slice) =>
      slice.subscribe(
        () => this.onRequestBuild(),
        (request, signal) => this._reload(request, signal),
        (request) => equals.deep(this._request, request),
      ),
    );

    const request = this.onRequestBuild();
    if (request === ServerSlice.UNINITIALIZED) this.loading = false;
    else this._reload(request, signal);
  }

  /**
   * Builds or transforms the request object before it is used in a fetch operation.
   *
   * @returns The new or transformed request object of type `TRequest`.
   *
   * @remarks
   * - This method can be overridden by subclasses to customize how the request is built or updated.
   * - By default, it returns the previous request unchanged.
   * - Useful for cases where the request depends on the state of the slice or its dependencies.
   */
  protected onRequestBuild(): TRequest {
    return this._request as TRequest;
  }

  /**
   * Fetches data from the server or a remote source.
   *
   * @param request - The request object of type `TRequest` to be used for the fetch operation.
   * @param signal - An `AbortSignal` that can be used to cancel the fetch operation if needed.
   * @returns The response of type `TResponse` or a promise resolving to `TResponse`.
   *
   * @remarks
   * - This method must be implemented by subclasses to define how data is fetched from the server.
   * - The `signal` parameter should be passed to any fetch or async operation to support cancellation.
   * - If the operation is aborted, the method should handle cleanup as necessary.
   * - The returned response will be stored in the slice's state upon successful completion.
   */
  protected abstract onFetch(
    request: TRequest,
    signal: AbortSignal,
  ): TResponse | Promise<TResponse>;

  private async _reload(
    request: TRequest | symbol,
    signal: AbortSignal,
  ): Promise<void> {
    this._request = request;
    this.loading = true;

    try {
      const response = await this.onFetch(request as TRequest, signal);
      signal.throwIfAborted();

      this._request = request;
      this.response = response;
    } catch (error) {
      if (signal.aborted) return;

      this._request = request;
      this.error = error;
    }
  }

  /**
   * Reloads the server slice by fetching data from the server or remote source.
   *
   * @param signal - An `AbortSignal` that can be used to cancel the fetch operation if needed.
   * @returns A promise that resolves when the reload operation is complete.
   *
   * @throws {Error} If called before the slice has been initialized with a request.
   *
   * @remarks
   * - Forces a reload even if the request has not changed.
   * - If the slice has not been initialized, an error is thrown.
   * - Updates the slice's state to reflect loading, success, or error based on the fetch result.
   * - Intended to be called by consumers or subclasses to manually trigger a data refresh.
   */
  protected async reload(signal: AbortSignal): Promise<void> {
    if (this._request === ServerSlice.UNINITIALIZED)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    return this._reload(this._request, signal);
  }

  /**
   * Reloads the server slice with a specific request by fetching data from the server or remote source.
   *
   * @param request - The request object of type `TRequest` to be used for the fetch operation.
   * @param equality - A function to compare the previous and new request. Defaults is undefined which means always different.
   * @param signal - An `AbortSignal` that can be used to cancel the fetch operation if needed.
   * @returns A promise that resolves when the reload operation is complete.
   *
   * @throws {Error} If the `onRequestBuild` method has been overridden in a subclass.
   *
   * @remarks
   * - Forces a reload with the provided request, regardless of the current state.
   * - If the `onRequestBuild` method has been overridden, an error is thrown to prevent inconsistencies.
   * - Updates the slice's state to reflect loading, success, or error based on the fetch result.
   * - Intended to be called by consumers or subclasses to manually trigger a data refresh with a new request.
   */
  protected async reloadWithRequest(
    request: TRequest,
    equality:
      | Func<boolean, [newRequest: TRequest, prevRequest: TRequest]>
      | undefined,
    signal: AbortSignal,
  ): Promise<void> {
    const prototype = isMethodOverridden(
      this,
      ServerSlice.prototype,
      "onRequestBuild",
    );
    if (!!prototype)
      throw new Error(
        `'${this.constructor.name}'.reloadWithRequest: you cannot override onRequestBuild method. It has been overridden at ${prototype.constructor.name}`,
      );

    if (
      !!equality &&
      this._request !== ServerSlice.UNINITIALIZED &&
      equality(request, this._request as TRequest)
    )
      return;

    await this._reload(request, signal);
  }
}
