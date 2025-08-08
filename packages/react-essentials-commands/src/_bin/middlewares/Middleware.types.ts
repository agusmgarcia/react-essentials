import { type AsyncFunc, type Func, type getPackageJSON } from "#src/utils";

export type Context = {
  command:
    | "build"
    | "check"
    | "deploy"
    | "format"
    | "postpack"
    | "prepack"
    | "regenerate"
    | "start"
    | "test";
  core: NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>;
  defer: Func<void, [callback: Func | AsyncFunc]>;
  essentialsCommands: boolean;
  essentialsCommandsName: string;
  filesToRegenerate: string[];
  name: string;
  paths: string[];
  version: string;
};
