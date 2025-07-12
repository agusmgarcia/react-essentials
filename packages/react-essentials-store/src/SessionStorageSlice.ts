import { type Const, type DeepPrimitive, sealed } from "#src/utils";

import type GlobalSlice from "./GlobalSlice";
import StorageSlice from "./StorageSlice";

export default abstract class SessionStorageSlice<
  TData extends DeepPrimitive,
  TSlices extends Record<string, GlobalSlice<any, any>> = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;

  protected constructor(name: string) {
    super();
    this._name = name;
  }

  protected override init(): void {
    super.init();

    window.addEventListener("storage", (event) => {
      if (event.storageArea !== sessionStorage) return;

      if (typeof event.key === "object") {
        this.response = undefined;
        return;
      }

      if (event.key !== this._name) return;

      if (typeof event.newValue === "object") {
        this.response = undefined;
        return;
      }

      this.response = JSON.parse(event.newValue);
    });
  }

  @sealed
  protected override getDataFromStorage(): Const<TData> | undefined {
    const item = sessionStorage.getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }

  @sealed
  protected override setDataIntoStorage(data: Const<TData> | undefined): void {
    if (typeof data === "undefined") sessionStorage.removeItem(this._name);
    else sessionStorage.setItem(this._name, JSON.stringify(data));
  }
}
