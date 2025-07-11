import ServerSlice from "./ServerSlice";
import { DeepPrimitive } from "./utils";

export default abstract class LocalStorageSlice<
  TData extends DeepPrimitive,
> extends ServerSlice {}
