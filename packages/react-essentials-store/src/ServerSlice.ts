import { delay, equals, errors } from "@agusmgarcia/react-essentials-utils";

import { type Const, type DeepPrimitive, sealed } from "#src/utils";

import GlobalSlice from "./GlobalSlice";

export default abstract class ServerSlice<
  TResponse extends DeepPrimitive,
  TSlices extends Record<string, GlobalSlice<any, any>> = {},
  TRequest extends DeepPrimitive = undefined,
> extends GlobalSlice<
  {
    error: string | undefined;
    loading: boolean;
    request: TRequest | {};
    response: TResponse | undefined;
  },
  TSlices
> {
  private static readonly UNINITIALIZED = {};
  private static readonly INITIALIZED = {};
  private static readonly ABORT_SYMBOL = Symbol("abort");

  protected constructor(initialResponse?: Const<TResponse>) {
    super({
      error: undefined,
      loading: true,
      request: ServerSlice.UNINITIALIZED,
      response: initialResponse,
    });
  }

  @sealed
  get response(): Const<TResponse> | undefined {
    return this.state.response;
  }

  @sealed
  protected set response(response: Const<TResponse> | undefined) {
    this.state = {
      error: undefined,
      loading: false,
      request: ServerSlice.INITIALIZED,
      response,
    };
  }

  protected override init(): void {
    super.init();

    Object.values(this.slices).forEach((slice) =>
      slice.subscribe(() => this.reload(this.buildRequest())),
    );

    this.reload(this.buildRequest());
  }

  protected abstract buildRequest(): Const<TRequest>;

  protected abstract fetch(
    request: Const<TRequest>,
    signal: AbortSignal,
  ): Const<TResponse> | Promise<Const<TResponse> | undefined> | undefined;

  @sealed
  protected async reload(req?: Const<TRequest>): Promise<void> {
    const forceReload = !arguments.length;

    const request = !!arguments.length
      ? (req as Const<TRequest>)
      : this.state.request === ServerSlice.UNINITIALIZED
        ? ServerSlice.ABORT_SYMBOL
        : (this.state.request as Const<TRequest>);

    if (typeof request === "symbol") return;
    if (!forceReload && equals.deep(this.state.request, request)) return;

    this.state = { ...this.state, loading: true, request };
    const signal = this.signal;

    try {
      await delay(0, signal);
      signal.throwIfAborted();

      const response = await this.fetch(request, signal);
      signal.throwIfAborted();

      this.state = { error: undefined, loading: false, request, response };
    } catch (error) {
      if (signal.aborted) return;

      this.state = {
        error: errors.getMessage(error),
        loading: false,
        request,
        response: undefined,
      };
    }
  }
}
