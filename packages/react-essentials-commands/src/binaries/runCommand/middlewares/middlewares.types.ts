import { type GetPackageJSONTypes } from "#src/functions";
import { type AsyncFunc, type Func } from "#src/types";

export type Context = {
  command:
    | "build"
    | "check"
    | "deploy"
    | "format"
    | "regenerate"
    | "start"
    | "test";
  core: NonNullable<GetPackageJSONTypes.Response["core"]>;
  defer: Func<void, [callback: Func | AsyncFunc]>;
  essentialsCommands: boolean;
  essentialsCommandsName: string;
  essentialsCommandsVersion: string;
  essentialsName: string;
  filesToRegenerate: string[];
  name: string;
  paths: string[];
  version: string;
};
