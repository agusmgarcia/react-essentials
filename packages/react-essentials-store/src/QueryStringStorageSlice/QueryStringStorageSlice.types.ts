import { type Primitive } from "@agusmgarcia/react-essentials-utils";

import { type StorageSliceTypes } from "#src/StorageSlice";

export type BaseData = Primitive;

export type BaseSlices = StorageSliceTypes.BaseSlices;

export type Configs = {
  mode: "push" | "replace";
};
