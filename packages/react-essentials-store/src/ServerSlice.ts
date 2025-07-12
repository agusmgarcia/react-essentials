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
    request: TRequest | symbol;
    response: TResponse | undefined;
  },
  TSlices
> {
  private static readonly NOT_INITIALIZED_SYMBOL = Symbol("Not initialized");
  private static readonly FORCE_RELOAD_SYMBOL = Symbol("Force reload");

  protected constructor(initialResponse?: Const<TResponse>) {
    super({
      error: undefined,
      loading: true,
      request: ServerSlice.NOT_INITIALIZED_SYMBOL,
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
      request: ServerSlice.NOT_INITIALIZED_SYMBOL,
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
  protected async reload(
    request: Const<TRequest> | symbol = ServerSlice.FORCE_RELOAD_SYMBOL,
  ): Promise<void> {
    if (request === ServerSlice.NOT_INITIALIZED_SYMBOL) return;

    if (equals.deep(this.state.request, newRequest)) return;
    this.state = { ...this.state, loading: true, request: newRequest };

    const signal = this.signal;

    try {
      await delay(0, signal);
      signal.throwIfAborted();

      const response = await this.fetch(newRequest as Const<TRequest>, signal);
      signal.throwIfAborted();

      this.state = {
        error: undefined,
        loading: false,
        request: newRequest,
        response,
      };
    } catch (error) {
      if (signal.aborted) return;

      this.state = {
        error: errors.getMessage(error),
        loading: false,
        request: newRequest,
        response: undefined,
      };
    }
  }
}
