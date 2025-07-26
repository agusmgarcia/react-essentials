import {
  type Const,
  equals,
  errors,
} from "@agusmgarcia/react-essentials-utils";

import GlobalSlice from "../GlobalSlice";
import { type BaseResponse, type BaseSlices } from "./ServerSlice.types";

export default abstract class ServerSlice<
  TResponse extends BaseResponse,
  TSlices extends BaseSlices = {},
  TRequest = undefined,
> extends GlobalSlice<
  {
    error: string | undefined;
    loading: boolean;
    response: TResponse | undefined;
  },
  TSlices
> {
  private static readonly UNINITIALIZED: any = {};

  private _controller: AbortController;
  private _request: Const<TRequest>;

  protected constructor(initialResponse?: Const<TResponse>) {
    super({
      error: undefined,
      loading: true,
      response: initialResponse,
    });

    this._controller = new AbortController();
    this._request = ServerSlice.UNINITIALIZED;
  }

  get response(): Const<TResponse> | undefined {
    return this.state.response;
  }

  protected set response(response: Const<TResponse> | undefined) {
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

  protected onBuildRequest(prevRequest: Const<TRequest>): Const<TRequest> {
    return prevRequest;
  }

  protected abstract fetch(
    request: Const<TRequest>,
    signal: AbortSignal,
  ): Const<TResponse> | Promise<Const<TResponse> | undefined> | undefined;

  private async _reload(
    request: Const<TRequest>,
    force: boolean,
  ): Promise<void> {
    if (!force && equals.deep(this._request, request)) return;
    this._request = request;

    this._controller.abort("New incoming request");
    this._controller = new AbortController();

    const signal = this._controller.signal;
    this.state = { ...this.state, loading: true };

    try {
      const response = await this.fetch(request, signal);
      signal.throwIfAborted();

      this._request = request;
      this.state = {
        error: undefined,
        loading: false,
        response,
      };
    } catch (error) {
      if (signal.aborted) return;

      this._request = request;
      this.state = {
        error: errors.getMessage(error),
        loading: false,
        response: undefined,
      };
    }
  }

  protected async reload(request?: Const<TRequest>): Promise<void> {
    if (!arguments.length && this._request === ServerSlice.UNINITIALIZED)
      throw new Error(`'${this.constructor.name}' hasn't been initialized yet`);

    return this._reload(
      (!arguments.length ? this._request : request) as Const<TRequest>,
      true,
    );
  }
}
