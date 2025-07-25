import { type Const, isSSR } from "@agusmgarcia/react-essentials-utils";

import StorageSlice from "../StorageSlice";
import { type BaseData, type BaseSlices } from "./LocalStorageSlice.types";

export default abstract class LocalStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;

  protected constructor(name: string) {
    super();
    this._name = name;
  }

  protected override init(): void {
    super.init();

    if (isSSR()) return;

    window.addEventListener("storage", (event) => {
      if (event.storageArea !== localStorage) return;

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

  protected override getDataFromStorage(): Const<TData> | undefined {
    if (isSSR()) return undefined;
    const item = localStorage.getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }

  protected override setDataIntoStorage(data: Const<TData> | undefined): void {
    if (isSSR()) return;
    if (typeof data === "undefined") localStorage.removeItem(this._name);
    else localStorage.setItem(this._name, JSON.stringify(data));
  }
}
