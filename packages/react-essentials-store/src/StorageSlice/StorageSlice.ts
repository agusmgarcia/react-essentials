import {
  equals,
  isMethodOverridden,
} from "@agusmgarcia/react-essentials-utils";

import { ServerSlice } from "../ServerSlice";
import { type BaseData, type BaseSlices } from "./StorageSlice.types";

/**
 * Abstract class representing a storage slice that extends the {@link ServerSlice}.
 *
 * This class provides a base for slices that synchronize their state with a storage mechanism
 * (such as localStorage, sessionStorage, or any custom storage). It subscribes to changes in the
 * `response` state and persists the data into storage using the provided abstract methods.
 *
 * @typeParam TData - The type of the data managed by the slice, extending {@link BaseData}.
 * @typeParam TSlices - The type of additional slices, extending {@link BaseSlices}. Defaults to an empty object.
 *
 * @remarks
 * - Subclasses must implement {@link getDataFromStorage} and {@link setDataIntoStorage} to define
 *   how data is retrieved from and saved to the storage.
 * - The `onInit` method sets up a subscription to automatically persist data changes.
 */
export default abstract class StorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends ServerSlice<TData | undefined, undefined, TSlices> {
  /**
   * Creates a new instance of the StorageSlice class.
   *
   * @remarks
   * This constructor is protected and intended to be called by subclasses.
   * It initializes the base ServerSlice.
   */
  protected constructor() {
    super(undefined);

    const prototype1 = isMethodOverridden(
      this,
      StorageSlice.prototype,
      "onRequestBuild",
    );
    if (!!prototype1)
      throw new Error(
        `'${this.constructor.name}': You cannot override onRequestBuild method. It has been overridden at ${prototype1.constructor.name}`,
      );

    const prototype2 = isMethodOverridden(
      this,
      StorageSlice.prototype,
      "onFetch",
    );
    if (!!prototype2)
      throw new Error(
        `'${this.constructor.name}': You cannot override onFetch method. It has been overridden at ${prototype2.constructor.name}`,
      );
  }

  protected override onInit(signal: AbortSignal): void {
    super.onInit(signal);

    this.subscribe(
      (state) => state.response,
      (data) => this.setDataIntoStorage(data),
      equals.deep,
    );
  }

  protected override onRequestBuild(): undefined {
    return undefined;
  }

  protected override onFetch(): TData | undefined {
    return this.getDataFromStorage();
  }

  /**
   * Retrieves the current data from the underlying storage mechanism.
   *
   * @returns The data of type `TData` if available in storage, or `undefined` if not present.
   *
   * @remarks
   * This method must be implemented by subclasses to define how data is fetched from storage
   * (e.g., localStorage, sessionStorage, IndexedDB, etc.).
   */
  protected abstract getDataFromStorage(): TData | undefined;

  /**
   * Persists the provided data into the underlying storage mechanism.
   *
   * @param data - The data of type `TData` to be stored, or `undefined` to clear the storage.
   *
   * @remarks
   * This method must be implemented by subclasses to define how data is saved to storage
   * (e.g., localStorage, sessionStorage, IndexedDB, etc.).
   * If `data` is `undefined`, the implementation should handle removal or clearing of the stored data.
   */
  protected abstract setDataIntoStorage(data: TData | undefined): void;
}
