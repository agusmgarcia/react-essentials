import semver from "semver";

import {
  args,
  execute,
  files,
  getPackageJSON,
  git,
  npm,
  properties,
} from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<Record<string, any>>({
  mapOutput: (output) =>
    properties.sort(output, [
      "name",
      "core",
      "version",
      "private",
      "main",
      "types",
      "exports",
      "exports.*.types",
      "exports.*.node",
      "exports.*.default",
      "author",
      "description",
      "bin",
      "scripts",
      "dependencies",
      "peerDependencies",
      "devDependencies",
      "optionalDependencies",
      "files",
      "engines",
      "publishConfig",
      "repository",
    ]),
  path: "package.json",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function packageMiddleware(
  context: Context,
): Promise<void> {
  await MIDDLEWARE(context);
  const fileArgs = args.get("file");
  if (
    context.command === "regenerate" &&
    (!fileArgs.length || fileArgs.includes("package.json"))
  )
    await execute("npm i", false);
  await files.removeFile(".npmignore");
}

async function getTemplate(context: Context): Promise<Record<string, any>> {
  const packageJSON = await getPackageJSON();

  const [repositoryDetails, remoteURL] = (await git.isInsideRepository())
    ? await Promise.all([git.getRepositoryDetails(), git.getRemoteURL()])
    : [undefined, undefined];

  const [
    essentialsCommandsVersion,
    azureFunctionsCoreToolsVersion,
    functionsVersion,
    nextVersion,
    reactVersion,
    reactDomVersion,
  ] = await Promise.all([
    packageJSON.dependencies?.[context.essentialsCommandsName] ||
      packageJSON.peerDependencies?.[context.essentialsCommandsName] ||
      packageJSON.devDependencies?.[context.essentialsCommandsName],
    npm.getVersion("azure-functions-core-tools@4").then((v) => `^${v}`),
    npm.getVersion("@azure/functions@4").then((v) => `^${v}`),
    npm.getVersion("next@15").then((v) => `^${v}`),
    npm.getVersion("react@19").then((v) => `^${v}`),
    npm.getVersion("react-dom@19").then((v) => `^${v}`),
  ]);

  const newPackageJSON = {
    ...packageJSON,
    author: packageJSON.author || repositoryDetails?.owner || "",
    core: context.core,
    dependencies: toUndefinedIfEmptyDependencies(
      context.core === "app" ||
        context.core === "azure-func" ||
        context.core === "node"
        ? aggregateDependencies(
            packageJSON.peerDependencies,
            packageJSON.dependencies,
            {
              [context.essentialsCommandsName]: undefined,
              "azure-functions-core-tools": undefined,
            },
            context.core === "app"
              ? {
                  "@azure/functions": undefined,
                  next: nextVersion,
                  react: reactVersion,
                  "react-dom": reactDomVersion,
                }
              : context.core === "azure-func"
                ? {
                    "@azure/functions": functionsVersion,
                    next: undefined,
                    react: undefined,
                    "react-dom": undefined,
                  }
                : {
                    "@azure/functions": undefined,
                    next: undefined,
                    react: undefined,
                    "react-dom": undefined,
                  },
          )
        : undefined,
    ),
    description: packageJSON.description || "",
    name: context.name,
    optionalDependencies: packageJSON.optionalDependencies,
    peerDependencies: toUndefinedIfEmptyDependencies(
      context.core === "app" ||
        context.core === "azure-func" ||
        context.core === "node"
        ? undefined
        : aggregateDependencies(
            packageJSON.dependencies,
            packageJSON.peerDependencies,
            {
              [context.essentialsCommandsName]: undefined,
              "@azure/functions": undefined,
              "azure-functions-core-tools": undefined,
              next: context.essentialsCommands ? nextVersion : undefined,
              react: context.essentialsCommands ? undefined : reactVersion,
              "react-dom": context.essentialsCommands
                ? undefined
                : reactDomVersion,
            },
          ),
    ),
    scripts: context.essentialsCommands
      ? {
          ...packageJSON.scripts,
          build: "tsx src/_bin/build.ts",
          check: "tsx src/_bin/check.ts",
          deploy: "tsx src/_bin/deploy.ts",
          format: "tsx src/_bin/format.ts",
          postpack: "tsx src/_bin/postpack.ts",
          prepack: "tsx src/_bin/prepack.ts",
          regenerate: "tsx src/_bin/regenerate.ts",
          start: "tsx src/_bin/start.ts",
          test: "tsx src/_bin/test.ts",
        }
      : {
          ...packageJSON.scripts,
          build: "react-essentials-commands-build",
          check: "react-essentials-commands-check",
          deploy: "react-essentials-commands-deploy",
          format: "react-essentials-commands-format",
          postpack: "react-essentials-commands-postpack",
          prepack: "react-essentials-commands-prepack",
          regenerate: "react-essentials-commands-regenerate",
          start: "react-essentials-commands-start",
          test: "react-essentials-commands-test",
        },
    version: context.version,

    ...(context.core === "app"
      ? {
          bin: undefined,
          engines: {
            ...packageJSON.engines,
            node: "22.16.0",
          },
          exports: undefined,
          files: undefined,
          main: undefined,
          private: true,
          publishConfig: undefined,
          repository: undefined,
          types: undefined,
        }
      : context.core === "azure-func"
        ? {
            bin: undefined,
            engines: {
              ...packageJSON.engines,
              node: "22.16.0",
            },
            exports: undefined,
            files: undefined,
            main: "dist/{index.js,functions/*.js}",
            private: true,
            publishConfig: undefined,
            repository: undefined,
            types: undefined,
          }
        : context.core === "lib"
          ? {
              bin: packageJSON.bin,
              engines: {
                ...packageJSON.engines,
                node:
                  !!packageJSON.engines?.node &&
                  semver.satisfies("22.16.0", packageJSON.engines.node)
                    ? packageJSON.engines.node
                    : "22.16.0",
              },
              exports: {
                ".": {
                  default: "./dist/index.js",
                  node: "./dist/index.node.js",
                  types: "./dist/index.d.ts",
                },
                "./*": {
                  default: "./dist/_out/*.js",
                  node: "./dist/_out/*.node.js",
                  types: "./dist/_out/*.d.ts",
                },
              },
              files: ["bin", "dist"],
              main: undefined,
              private: false,
              publishConfig: {
                ...packageJSON.publishConfig,
                access: packageJSON.publishConfig?.access || "public",
              },
              repository:
                packageJSON.repository ||
                (!!remoteURL
                  ? { type: "git", url: `git+${remoteURL}.git` }
                  : undefined),
              types: undefined,
            }
          : {
              bin: undefined,
              engines: {
                ...packageJSON.engines,
                node: "22.16.0",
              },
              exports: undefined,
              files: undefined,
              main: undefined,
              private: true,
              publishConfig: undefined,
              repository: undefined,
              types: undefined,
            }),
  };

  newPackageJSON.devDependencies = toUndefinedIfEmptyDependencies(
    context.core === "app" ||
      context.core === "azure-func" ||
      context.core === "node"
      ? aggregateDependencies(
          substractDependencies(
            packageJSON.devDependencies,
            packageJSON.peerDependencies,
            packageJSON.dependencies,
          ),
          {
            [context.essentialsCommandsName]: essentialsCommandsVersion,
            "azure-functions-core-tools":
              context.core === "azure-func"
                ? azureFunctionsCoreToolsVersion
                : undefined,
          },
        )
      : aggregateDependencies(
          packageJSON.dependencies,
          packageJSON.peerDependencies,
          packageJSON.devDependencies,
          { "azure-functions-core-tools": undefined },
        ),
  );

  return newPackageJSON;
}

function toUndefinedIfEmptyDependencies(
  dependencies: Record<string, string | undefined> | undefined,
): Record<string, string> | undefined {
  if (!dependencies) return undefined;

  const keys = Object.keys(dependencies).filter(
    (k) => typeof dependencies[k] !== "undefined",
  );

  if (!keys.length) return undefined;
  return dependencies as Record<string, string>;
}

function aggregateDependencies(
  ...dependenciesList: (Record<string, string | undefined> | undefined)[]
): Record<string, string | undefined> {
  let result = {};
  for (const dependencies of dependenciesList)
    result = { ...result, ...dependencies };
  return result;
}

function substractDependencies(
  dependencies: Record<string, string | undefined> | undefined,
  ...dependenciesList: (Record<string, string | undefined> | undefined)[]
) {
  const result = { ...dependencies };
  for (const dependencies of dependenciesList)
    Object.keys(dependencies || {}).forEach((key) => delete result[key]);
  return result;
}
