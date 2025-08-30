import {
  emptyFunction,
  type Func,
  isSSR,
} from "@agusmgarcia/react-essentials-utils";

import StorageSlice from "../StorageSlice";
import {
  type BaseData,
  type BaseSlices,
  type Configs,
} from "./QueryStringStorageSlice.types";

/**
 * Abstract class for synchronizing a storage slice with the browser's query string.
 *
 * This class extends `StorageSlice` and provides mechanisms to serialize and deserialize
 * data to and from the URL query string. It periodically checks for changes in the query string
 * and updates its internal state accordingly. It also updates the query string when the data changes.
 *
 * @typeParam TData - The type of the data managed by this slice.
 * @typeParam TSlices - The type of additional slices, defaults to an empty object.
 *
 * @remarks
 * - Uses polling (with configurable interval) to detect query string changes.
 * - Supports SSR by disabling all browser-specific logic when running on the server.
 * - Serializes nested objects and arrays into query string format.
 */
export default abstract class QueryStringStorageSlice<
  TData extends BaseData,
  TSlices extends BaseSlices = {},
> extends StorageSlice<TData, TSlices> {
  private readonly _name: string;
  private readonly _mode: Configs["mode"];
  private readonly _interval: Configs["interval"];

  private _clearIntervalHandler: Func;

  /**
   * Creates a new instance of the QueryStringStorageSlice.
   *
   * @param name - The unique name used to identify the slice in the query string.
   * @param configs - Optional configuration object to customize the storage behavior.
   */
  protected constructor(name: string, configs?: Partial<Configs>) {
    super(undefined);

    this._name = name;
    this._mode = configs?.mode || "replace";
    this._interval = configs?.interval || 1000;

    this._clearIntervalHandler = emptyFunction;
  }

  protected override onInit(): void {
    super.onInit();

    if (isSSR()) return;
    let prevSearch = location.search;

    const handler = setInterval(() => {
      const search = location.search;

      if (prevSearch === search) return;
      prevSearch = search;

      this.response = deserialize(this._name, new URLSearchParams(search));
    }, this._interval);

    this._clearIntervalHandler = () => clearInterval(handler);
  }

  protected override onDestroy(): void {
    this._clearIntervalHandler();
    super.onDestroy();
  }

  protected override getDataFromStorage(): TData | undefined {
    if (isSSR()) return undefined;
    const params = new URLSearchParams(location.search);
    return deserialize(this._name, params);
  }

  protected override setDataIntoStorage(data: TData | undefined): void {
    if (isSSR()) return;
    const url = new URL(location.href);
    serialize(this.constructor.name, data, this._name, url.searchParams);
    history[`${this._mode}State`](null, "", url.toString());
  }
}

function deserialize<TInstance>(
  key: string,
  params: URLSearchParams,
): TInstance {
  function getSegments(key: string) {
    return key
      .replace(/\[(\d+)\]/g, ".[$1]")
      .split(".")
      .filter((childKey) => !!childKey);
  }

  function getChildKey(key: string) {
    const maybeIndex = +key.replace(/\[(\d+)\]/, "$1");
    return isNaN(maybeIndex) ? key : maybeIndex;
  }

  const matchedKeys = params
    .keys()
    .filter((k) => !k.match(/^\[\d+\]/))
    .filter((k) => k.startsWith(key))
    .toArray();

  const result = matchedKeys.reduce((result, matchedKey) => {
    const segments = getSegments(matchedKey);

    let aux = result;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const childKey = getChildKey(segment);

      if (i === segments.length - 1) {
        (aux as any)[childKey] = params.get(matchedKey);
        break;
      }

      const nextSegment = segments[i + 1];
      const nextChildKey = getChildKey(nextSegment);
      aux = (aux as any)[childKey] ||=
        typeof nextChildKey === "string" ? {} : [];
    }

    return result;
  }, {});

  const segments = getSegments(key);
  let aux = result;

  for (const segment of segments) {
    const childKey = getChildKey(segment);
    aux = (aux as any)[childKey];
  }

  return aux as TInstance;
}

function serialize(
  sliceName: string,
  instance: unknown,
  key: string,
  params: URLSearchParams,
): void {
  if (
    typeof instance === "boolean" ||
    typeof instance === "number" ||
    typeof instance === "string"
  ) {
    if (!key)
      throw new Error(
        `'${sliceName}' must specified a name if the data is of type '${typeof instance}'`,
      );

    params.set(key, instance.toString());
    return;
  }

  if (typeof instance === "undefined") {
    if (!key)
      throw new Error(
        `'${sliceName}' must specified a name if the data is of type 'undefined'`,
      );

    params.delete(key);
    return;
  }

  if (typeof instance !== "object")
    throw new Error(`${typeof instance} not supported`);

  if (!instance) {
    if (!key)
      throw new Error(
        `'${sliceName}' must specified a name if the data is of type 'null'`,
      );

    params.delete(key);
    return;
  }

  if (Array.isArray(instance)) {
    if (!key) throw new Error(`'${sliceName}' can't be of type 'array'`);

    instance.map((child, childIndex) =>
      serialize(sliceName, child, `${key}[${childIndex}]`, params),
    );
    return;
  }

  Object.keys(instance).forEach((childKey) =>
    serialize(
      sliceName,
      instance[childKey as keyof typeof instance],
      `${key}${!!key ? "." : ""}${childKey}`,
      params,
    ),
  );
}
