import { equals } from "@agusmgarcia/react-essentials-utils";

import { type Const, type DeepPrimitive, sealed } from "#src/utils";

import type GlobalSlice from "./GlobalSlice";
import ServerSlice from "./ServerSlice";

export default abstract class StorageSlice<
  TData extends DeepPrimitive,
  TSlices extends Record<string, GlobalSlice<any, any>> = {},
> extends ServerSlice<TData, TSlices> {
  protected constructor(initialData?: Const<TData>) {
    super(initialData);
  }

  protected override init(): void {
    super.init();

    this.subscribe<TData | undefined>(
      (data) => this.setDataIntoStorage(data),
      (state) => state.response,
      equals.deep,
    );
  }

  @sealed
  protected override buildRequest(): undefined {
    return undefined;
  }

  @sealed
  protected override fetch(): Const<TData> | undefined {
    return this.getDataFromStorage();
  }

  protected abstract getDataFromStorage(): Const<TData> | undefined;

  protected abstract setDataIntoStorage(data: Const<TData> | undefined): void;
}
