import { type Const, isSSR } from "@agusmgarcia/react-essentials-utils";

import StorageSlice from "../StorageSlice";
import { type BaseData, type BaseSlices } from "./SessionStorageSlice.types";

export default abstract class SessionStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;

  protected constructor(name: string, initialData?: TData) {
    super(initialData);
    this._name = name;
  }

  protected override onInit(): void {
    super.onInit();

    if (isSSR()) return;

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

  protected override getDataFromStorage(): Const<TData> | undefined {
    if (isSSR()) return undefined;
    const item = sessionStorage.getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }

  protected override setDataIntoStorage(data: Const<TData> | undefined): void {
    if (isSSR()) return undefined;
    if (typeof data === "undefined") sessionStorage.removeItem(this._name);
    else sessionStorage.setItem(this._name, JSON.stringify(data));
  }
}
