import { type Const, equals } from "@agusmgarcia/react-essentials-utils";

import ServerSlice from "../ServerSlice";
import { type BaseData, type BaseSlices } from "./StorageSlice.types";

export default abstract class StorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends ServerSlice<TData, TSlices, undefined> {
  protected constructor(initialData?: TData) {
    super(initialData);
  }

  protected override onInit(): void {
    super.onInit();

    this.subscribe(
      (state) => state.response,
      (data) => this.setDataIntoStorage(data),
      equals.deep,
    );
  }

  protected override onBuildRequest(): undefined {
    return undefined;
  }

  protected override fetch(): Const<TData> | undefined {
    return this.getDataFromStorage();
  }

  protected abstract getDataFromStorage(): Const<TData> | undefined;

  protected abstract setDataIntoStorage(data: Const<TData> | undefined): void;
}
