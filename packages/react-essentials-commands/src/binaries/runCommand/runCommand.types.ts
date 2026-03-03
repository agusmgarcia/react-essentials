import { type AsyncFunc } from "#src/types";

import { type MiddlewaresTypes } from "./middlewares";

export type Input = [
  command: MiddlewaresTypes.Context["command"],
  ...commands: AsyncFunc[],
];

export type Output = void;
