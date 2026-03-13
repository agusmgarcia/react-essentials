import { type CreateFileMiddlewareTypes } from "#src/binaries/utils";
import { type AsyncFunc } from "#src/types";

export type Input = [
  command: CreateFileMiddlewareTypes.Context["command"],
  ...commands: AsyncFunc[],
];

export type Output = void;
