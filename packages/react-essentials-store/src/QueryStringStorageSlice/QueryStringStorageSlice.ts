import { type Const, errors, isSSR } from "@agusmgarcia/react-essentials-utils";

import StorageSlice from "../StorageSlice";
import {
  type BaseData,
  type BaseSlices,
  type Configs,
} from "./QueryStringStorageSlice.types";

export default abstract class QueryStringStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;
  private readonly _mode: Configs["mode"];

  protected constructor(name: string, configs?: Const<Partial<Configs>>) {
    super();
    this._name = name;
    this._mode = configs?.mode || "replace";
  }

  protected override onInit(): void {
    super.onInit();

    if (isSSR()) return;
    let prevSearch = location.search;

    setInterval(() => {
      const search = location.search;

      if (prevSearch === search) return;
      prevSearch = search;

      const item = new URLSearchParams(search).get(this._name);
      this.response =
        typeof item === "object"
          ? undefined
          : errors.handle(
              () => JSON.parse(item),
              () => item,
            );
    }, 1000);
  }

  protected override getDataFromStorage(): Const<TData> | undefined {
    if (isSSR()) return undefined;
    const params = new URLSearchParams(location.search);
    const item = params.get(this._name);
    if (typeof item === "object") return undefined;
    return errors.handle(
      () => JSON.parse(item),
      () => item,
    );
  }

  protected override setDataIntoStorage(data: Const<TData> | undefined): void {
    if (isSSR()) return;
    const url = new URL(location.href);
    const params = url.searchParams;
    if (typeof data === "undefined") params.delete(this._name);
    else params.set(this._name, JSON.stringify(data));
    history[`${this._mode}State`](null, "", url.toString());
  }
}
