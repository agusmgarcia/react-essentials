import {
  emptyFunction,
  type Func,
  isMethodOverridden,
  isSSR,
} from "@agusmgarcia/react-essentials-utils";

import { StorageSlice } from "../StorageSlice";
import {
  type BaseData,
  type BaseSlices,
  type StorageType,
} from "./BrowserStorageSlice.types";

/**
 * Abstract class representing a slice of data that is synchronized with the browser's storage.
 *
 * This class extends `StorageSlice` and provides automatic synchronization between the internal state
 * and the corresponding entry in the browser storage. It also listens for storage events to keep the state
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
export default abstract class BrowserStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;
  private readonly _storage: StorageType;

  private _removeStorageEventHandler: Func;

  /**
   * Creates a new instance of the BrowserStorageSlice.
   *
   * @param name - The unique key used to store and retrieve data from the storage.
   * @param storage - The type of storage to use: "local" for localStorage or "session" for sessionStorage.
   *
   * @remarks
   * This constructor initializes the browser storage slice with a specific name.
   * It also sets up the internal storage event handler for synchronization across browser tabs.
   */
  protected constructor(name: string, storage: StorageType) {
    super();

    this._name = name;
    this._storage = storage;

    this._removeStorageEventHandler = emptyFunction;

    const prototype1 = isMethodOverridden(
      this,
      BrowserStorageSlice.prototype,
      "getDataFromStorage",
    );
    if (!!prototype1)
      throw new Error(
        `'${this.constructor.name}': You cannot override getDataFromStorage method. It has been overridden at ${prototype1.constructor.name}`,
      );

    const prototype2 = isMethodOverridden(
      this,
      BrowserStorageSlice.prototype,
      "setDataIntoStorage",
    );
    if (!!prototype2)
      throw new Error(
        `'${this.constructor.name}': You cannot override setDataIntoStorage method. It has been overridden at ${prototype2.constructor.name}`,
      );
  }

  protected override onInit(signal: AbortSignal): void {
    super.onInit(signal);
    if (isSSR()) return;

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.storageArea !== window[`${this._storage}Storage`]) return;

      if (typeof event.key === "object") {
        this["_regenerateSignal"]();
        this.response = undefined;
        return;
      }

      if (event.key !== this._name) return;

      if (typeof event.newValue === "object") {
        this["_regenerateSignal"]();
        this.response = undefined;
        return;
      }

      this["_regenerateSignal"]();
      try {
        this.response = JSON.parse(event.newValue);
      } catch (error) {
        this.error = error;
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    this._removeStorageEventHandler = () =>
      window.removeEventListener("storage", handleStorageEvent);
  }

  protected override onDestroy(signal: AbortSignal): void {
    this._removeStorageEventHandler();
    super.onDestroy(signal);
  }

  protected override getDataFromStorage(): TData | undefined {
    if (isSSR()) return undefined;
    const item = window[`${this._storage}Storage`].getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }

  protected override setDataIntoStorage(data: TData | undefined): void {
    if (isSSR()) return;
    if (typeof data === "undefined")
      window[`${this._storage}Storage`].removeItem(this._name);
    else
      window[`${this._storage}Storage`].setItem(
        this._name,
        JSON.stringify(data),
      );
  }
}
