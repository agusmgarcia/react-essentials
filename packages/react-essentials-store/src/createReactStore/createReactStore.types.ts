import { type Const, type Func } from "@agusmgarcia/react-essentials-utils";

import { type StoreTypes } from "../Store";

export type BaseSliceFactories = StoreTypes.BaseSliceFactories;

export type Input<TSliceFactories extends BaseSliceFactories> = {
  middlewares?: StoreTypes.Configs<TSliceFactories>["middlewares"];
  slices: TSliceFactories;
};

export type Output<TSliceFactories extends BaseSliceFactories> = {
  StoreProvider: Func<
    React.ReactElement,
    [
      props: {
        children?: React.ReactNode;
      } & Omit<StoreTypes.Configs<TSliceFactories>, "middlewares">,
    ]
  >;
  useSelector: <TSelectedData>(
    selector: Func<
      TSelectedData,
      [state: Const<StoreTypes.StateOf<TSliceFactories>, "shallow">]
    >,
  ) => TSelectedData;
};
