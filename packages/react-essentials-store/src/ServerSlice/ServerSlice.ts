import { equals } from "@agusmgarcia/react-essentials-utils";

import GlobalSlice from "../GlobalSlice";
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
  { error: any; loading: boolean; response: TResponse | undefined },
  TSlices
> {
  private static readonly UNINITIALIZED: any = Symbol("UNINITIALIZED");

  private _controller: AbortController;
  private _request: TRequest;

  /**
   * Creates a new instance of the ServerSlice.
   *
   * @param initialResponse - (Optional) The initial response to set in the state. If not provided, the response will be undefined and loading will be set to true.
   *
   * @remarks
   * - Initializes the internal AbortController and request state.
   * - Sets the initial state with the provided response, or undefined if not provided.
   * - This constructor is protected and intended to be called by subclasses.
   */
  protected constructor(initialResponse?: TResponse) {
    super({ error: undefined, loading: true, response: initialResponse });

    this._controller = new AbortController();
    this._request = ServerSlice.UNINITIALIZED;
  }

  /**
   * Gets the current response from the server slice state.
   *
   * @returns The current response of type `TResponse`, or `undefined` if no response is available.
   *
   * @remarks
   * - This getter provides access to the latest response stored in the slice's state.
   * - The response is updated when a fetch operation completes successfully.
   * - If no response has been fetched yet, or if an error occurred, this may be `undefined`.
   */
  get response(): TResponse | undefined {
    return this.state.response;
  }

  /**
   * Sets the response in the server slice state.
   *
   * @param response - The new response of type `TResponse` or `undefined` to set in the state.
   *
   * @remarks
   * - This protected setter updates the state with the provided response.
   * - It also resets the error to `undefined` and sets `loading` to `false`.
   * - Intended to be used by subclasses to update the response after a fetch operation.
   */
  protected set response(response: TResponse | undefined) {
    this.state = { error: undefined, loading: false, response };
  }

  protected override onInit(): void {
    super.onInit();

    this.subscribe(
      (state) => state.response,
      () => {
        this._controller.abort("Response changed");
        this._controller = new AbortController();
      },
    );

    Object.values(this.slices).forEach((slice) =>
      slice.subscribe(() =>
        this._reload(this.onBuildRequest(this._request), false),
      ),
    );

    const request = this.onBuildRequest(this._request);
    if (request === ServerSlice.UNINITIALIZED)
      this.state = { ...this.state, loading: false };
    else this._reload(request, false);
  }

  /**
   * Builds or transforms the request object before it is used in a fetch operation.
   *
   * @param prevRequest - The previous request object of type `TRequest`.
   * @returns The new or transformed request object of type `TRequest`.
   *
   * @remarks
   * - This method can be overridden by subclasses to customize how the request is built or updated.
   * - By default, it returns the previous request unchanged.
   * - Useful for cases where the request depends on the state of the slice or its dependencies.
   */
  protected onBuildRequest(prevRequest: TRequest): TRequest {
    return prevRequest;
  }

  /**
   * Fetches data from the server or a remote source.
   *
   * @param request - The request object of type `TRequest` to be used for the fetch operation.
   * @param signal - An `AbortSignal` that can be used to cancel the fetch operation if needed.
   * @returns The response of type `TResponse`, a promise resolving to `TResponse` or `undefined`, or `undefined` if no response is available.
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
  ): TResponse | Promise<TResponse | undefined> | undefined;

  private async _reload(request: TRequest, force: boolean): Promise<void> {
    if (!force && equals.deep(this._request, request)) return;
    this._request = request;

    this._controller.abort("New incoming request");
    this._controller = new AbortController();

    const signal = this._controller.signal;
    this.state = { ...this.state, loading: true };

    try {
      const response = await this.onFetch(request, signal);
      signal.throwIfAborted();

      this._request = request;
      this.state = { error: undefined, loading: false, response };
    } catch (error) {
      if (signal.aborted) return;

      this._request = request;
      this.state = { ...this.state, error, loading: false };
    }
  }

  /**
   * Reloads the server slice by fetching data from the server or remote source.
   *
   * @param request - (Optional) The request object of type `TRequest` to use for the fetch operation. If not provided, the last used request will be used.
   * @returns A promise that resolves when the reload operation is complete.
   *
   * @throws {Error} If called before the slice has been initialized with a request.
   *
   * @remarks
   * - Forces a reload even if the request has not changed.
   * - If no request is provided and the slice has not been initialized, an error is thrown.
   * - Updates the slice's state to reflect loading, success, or error based on the fetch result.
   * - Intended to be called by consumers or subclasses to manually trigger a data refresh.
   */
  protected async reload(request?: TRequest): Promise<void> {
    if (!arguments.length && this._request === ServerSlice.UNINITIALIZED)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    return this._reload(
      (!arguments.length ? this._request : request) as TRequest,
      true,
    );
  }
}
