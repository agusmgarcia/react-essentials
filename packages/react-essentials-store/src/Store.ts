import type GlobalSlice from "./GlobalSlice";

export default class Store<
  TSlices extends Record<string, GlobalSlice<any, any>>,
> {
  constructor();
}

type SliceFactories<TSlices extends Record<string, GlobalSlice<any, any>>> = {
  [TKey in keyof TSlices]: new () => TSlices[TKey];
};
