import {
  emptyFunction,
  type Func,
  isSSR,
} from "@agusmgarcia/react-essentials-utils";

import StorageSlice from "../StorageSlice";
import { type BaseData, type BaseSlices } from "./LocalStorageSlice.types";

/**
 * Abstract class representing a slice of data that is synchronized with the browser's `localStorage`.
 *
 * This class extends `StorageSlice` and provides automatic synchronization between the internal state
 * and the corresponding entry in `localStorage`. It also listens for storage events to keep the state
 * in sync across multiple browser tabs or windows.
 *
 * @typeParam TData - The type of the data managed by this slice. Must extend `BaseData`.
 * @typeParam TSlices - The type of additional slices, defaults to an empty object.
 *
 * @remarks
 * - This class should be extended to implement specific storage slice logic.
 * - It is designed to be used in non-SSR (client-side) environments.
 * - Handles initialization, destruction, and storage event synchronization automatically.
 */
export default abstract class LocalStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;

  private _removeStorageEventHandler: Func;

  /**
   * Creates a new instance of the LocalStorageSlice.
   *
   * @param name - The unique key used to store and retrieve data from localStorage.
   * @param initialData - (Optional) The initial data to populate the slice with.
   *
   * @remarks
   * This constructor initializes the local storage slice with a specific name and optional initial data.
   * It also sets up the internal storage event handler for synchronization across browser tabs.
   */
  constructor(name: string, initialData?: TData) {
    super(initialData);

    this._name = name;

    this._removeStorageEventHandler = emptyFunction;
  }

  protected override onInit(): void {
    super.onInit();

    if (isSSR()) return;

    const handleStorageEvent = (event: StorageEvent) => {
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
    };

    window.addEventListener("storage", handleStorageEvent);

    this._removeStorageEventHandler = () =>
      window.removeEventListener("storage", handleStorageEvent);
  }

  protected override onDestroy(): void {
    this._removeStorageEventHandler();
    super.onDestroy();
  }

  protected override getDataFromStorage(): TData | undefined {
    if (isSSR()) return undefined;
    const item = localStorage.getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }

  protected override setDataIntoStorage(data: TData | undefined): void {
    if (isSSR()) return;
    if (typeof data === "undefined") localStorage.removeItem(this._name);
    else localStorage.setItem(this._name, JSON.stringify(data));
  }
}
