import {
  type AsyncFunc,
  type Func,
  type GetPackageJSONTypes,
} from "#src/utils";

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
