import {
  type Const,
  type Func,
  type OmitProperty,
} from "@agusmgarcia/react-essentials-utils";

export type BaseSliceFactories = Record<string, new (...args: any) => any>;

export type Middleware<TSliceFactories extends BaseSliceFactories> = Func<
  any,
  [callback: Func<any>, state: Const<StateOf<TSliceFactories>, "shallow">]
>;

export type Configs<TSliceFactories extends BaseSliceFactories> = {
  devTools?: boolean | string;
  middlewares?:
    | Middleware<TSliceFactories>
    | Const<Middleware<TSliceFactories>[], "strict">;
} & (ParamsOf<TSliceFactories> extends Record<string, never>
  ? { params?: undefined }
  : { params: Const<ParamsOf<TSliceFactories>> });

export type Input<TSliceFactories extends BaseSliceFactories> =
  ParamsOf<TSliceFactories> extends Record<string, never>
    ? [
        sliceFactories: Const<TSliceFactories, "strict">,
        configs?: Configs<TSliceFactories>,
      ]
    : [
        sliceFactories: Const<TSliceFactories, "strict">,
        configs: Configs<TSliceFactories>,
      ];

export type ParamsOf<TSliceFactories extends BaseSliceFactories> = {
  [TKey in keyof TSliceFactories as ConstructorParameters<
    TSliceFactories[TKey]
  > extends never[]
    ? never
    : TKey]: ConstructorParameters<TSliceFactories[TKey]>;
};

export type SlicesOf<TSliceFactories extends BaseSliceFactories> = {
  [TKey in keyof TSliceFactories]: InstanceType<TSliceFactories[TKey]>;
};

export type StateOf<TSliceFactories extends BaseSliceFactories> = OmitProperty<
  SlicesOf<TSliceFactories>,
  "subscribe",
  "shallow"
>;

export type Listener<TSliceFactories extends BaseSliceFactories> = Func<
  void,
  [state: Const<StateOf<TSliceFactories>, "shallow">]
>;

export type Unsubscribe = Func;
