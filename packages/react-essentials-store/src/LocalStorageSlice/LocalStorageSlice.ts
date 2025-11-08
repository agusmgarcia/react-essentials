import { BrowserStorageSlice } from "../BrowserStorageSlice";
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
> extends BrowserStorageSlice<TData, TSlices> {
  /**
   * Creates a new instance of the LocalStorageSlice.
   *
   * @param name - The unique key used to store and retrieve data from localStorage.
   *
   * @remarks
   * This constructor initializes the local storage slice with a specific name.
   * It also sets up the internal storage event handler for synchronization across browser tabs.
   */
  protected constructor(name: string) {
    super(name, "local");
  }
}
