import type GlobalSlice from "./GlobalSlice";

export default class Store<
  TSlices extends Record<string, GlobalSlice<any, any>>,
> {
  constructor();
}
