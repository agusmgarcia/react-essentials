import path from "path";

import {
  args,
  type AsyncFunc,
  type Func,
  getPackageJSON,
  git,
} from "#src/utils";

import packageJSONEssentialsCommands from "../../package.json";
import middlewares, { type MiddlewaresTypes } from "./middlewares";

export default async function run(
  command: MiddlewaresTypes.Context["command"],
  ...commands: AsyncFunc[]
): Promise<void> {
  const list = new Array<Func | AsyncFunc>();

  try {
    const context = await createContext(command, list);
    await Promise.all(middlewares.map((m) => m(context)));

    if (command === "start") await executeDeferred(list);
    for (const cmd of commands) await cmd();
  } finally {
    if (command !== "start") await executeDeferred(list);
  }
}

async function createContext(
  command: MiddlewaresTypes.Context["command"],
  list: (Func | AsyncFunc)[],
): Promise<MiddlewaresTypes.Context> {
  const packageJSON = await getPackageJSON();
  if (!packageJSON.core)
    throw new Error("'core' property is missing within the 'package.json'");

  const name =
    packageJSON.name ||
    (await git
      .isInsideRepository()
      .then((inside) => (inside ? git.getRepositoryDetails() : undefined))
      .then((d) => (!!d ? `@${d.owner}/${d.name}` : undefined))
      .then((name) => name || path.basename(process.cwd()))) ||
    "";

  return {
    command,
    core: packageJSON.core,
    defer: (callback) => list.push(callback),
    essentialsCommands: packageJSON.name === packageJSONEssentialsCommands.name,
    essentialsCommandsName: packageJSONEssentialsCommands.name,
    filesToRegenerate: args.getStrings("file"),
    name,
    paths: args.getStrings("path"),
    version: packageJSON.version || "0.0.0",
  };
}

async function executeDeferred(list: (Func | AsyncFunc)[]): Promise<void> {
  let promise = Promise.resolve();
  for (let i = list.length - 1; i >= 0; i--) promise = promise.then(list[i]);
  await promise;
}
