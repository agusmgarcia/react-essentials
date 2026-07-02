import { type CreateFileMiddlewareTypes } from "#src/binaries/createFileMiddleware";
import { type AsyncFunc } from "#src/types";

export type Input = [
  command: CreateFileMiddlewareTypes.Context["command"],
  ...commands: AsyncFunc[],
];

export type Output = void;
