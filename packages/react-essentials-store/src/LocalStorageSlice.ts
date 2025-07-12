import { equals } from "@agusmgarcia/react-essentials-utils";

import { type Const, type DeepPrimitive, sealed } from "#src/utils";

import type GlobalSlice from "./GlobalSlice";
import ServerSlice from "./ServerSlice";

export default abstract class LocalStorageSlice<
  TData extends DeepPrimitive,
  TSlices extends Record<string, GlobalSlice<any, any>> = {},
> extends ServerSlice<TData, TSlices> {
  private readonly _name: string;

  protected constructor(name: string) {
    super();
    this._name = name;
  }

  protected override init(): void {
    super.init();

    this.subscribe<TData | undefined>(
      (data) =>
        typeof data !== "undefined"
          ? localStorage.setItem(this._name, JSON.stringify(data))
          : localStorage.removeItem(this._name),
      (state) => state.response,
      equals.deep,
    );

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

  @sealed
  protected override buildRequest(): undefined {
    return undefined;
  }

  @sealed
  protected override fetch(): Const<TData> | undefined {
    const item = localStorage.getItem(this._name);
    if (typeof item === "object") return undefined;
    return JSON.parse(item);
  }
}
