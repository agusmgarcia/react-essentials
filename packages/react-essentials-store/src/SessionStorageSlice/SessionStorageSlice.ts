import {
  emptyFunction,
  type Func,
  isSSR,
} from "@agusmgarcia/react-essentials-utils";

import { StorageSlice } from "../StorageSlice";
import { type BaseData, type BaseSlices } from "./SessionStorageSlice.types";

/**
 * Abstract class representing a slice of data that is synchronized with the browser's `sessionStorage`.
 *
 * This class extends `StorageSlice` and provides automatic synchronization between the internal state
 * and the corresponding entry in `sessionStorage`. It also listens for storage events to keep the state
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
export default abstract class SessionStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;

  private _removeStorageEventHandler: Func;

  /**
   * Creates a new instance of the SessionStorageSlice.
   *
   * @param name - The unique key used to store and retrieve data from sessionStorage.
   *
   * @remarks
   * This constructor initializes the session storage slice with a specific name.
   * It also sets up the internal storage event handler for synchronization across browser tabs.
   */
  protected constructor(name: string) {
    super();

    this._name = name;

    this._removeStorageEventHandler = emptyFunction;
  }

  protected override onInit(signal: AbortSignal): void {
    super.onInit(signal);

    if (isSSR()) return;

    const handleStorageEvent = (event: StorageEvent) => {
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
    const item = sessionStorage.getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }

  protected override setDataIntoStorage(data: TData | undefined): void {
    if (isSSR()) return undefined;
    if (typeof data === "undefined") sessionStorage.removeItem(this._name);
    else sessionStorage.setItem(this._name, JSON.stringify(data));
  }
}
