import { properties } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

export default createFileMiddleware<Record<string, any>>({
  mapOutput: (output) =>
    properties.sort(output, [
      "extends",
      "compilerOptions",
      "exclude",
      "include",
      "ts-node",
    ]),
  path: "tsconfig.json",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(context: Context): Record<string, any> {
  return context.core === "app"
    ? {
        compilerOptions: {
          baseUrl: "./",
          module: "esnext",
          moduleResolution: "bundler",
          paths: {
            "#public/*": ["public/*"],
            "#src/*": ["src/*"],
          },
        },
        exclude: context.essentialsCommands
          ? [".next", "dist", "node_modules", "webpack.config.ts"]
          : [".next", "dist", "node_modules"],
        extends: context.essentialsCommands
          ? "./src/_out/tsconfig.base.json"
          : `${context.essentialsCommandsName}/tsconfig.json`,
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
        "ts-node": context.essentialsCommands
          ? {
              compilerOptions: { module: "commonjs" },
              require: ["tsconfig-paths/register"],
            }
          : undefined,
      }
    : context.core === "azure-func"
      ? {
          compilerOptions: {
            baseUrl: "./",
            module: "esnext",
            moduleResolution: "bundler",
            outDir: "./dist",
            paths: {
              "#src/*": ["src/*"],
            },
            rootDir: "./src",
          },
          exclude: context.essentialsCommands
            ? [".next", "dist", "node_modules", "webpack.config.ts"]
            : [".next", "dist", "node_modules"],
          extends: context.essentialsCommands
            ? "./src/_out/tsconfig.base.json"
            : `${context.essentialsCommandsName}/tsconfig.json`,
          include: ["**/*.ts"],
          "ts-node": context.essentialsCommands
            ? {
                compilerOptions: { module: "commonjs" },
                require: ["tsconfig-paths/register"],
              }
            : undefined,
        }
      : context.core === "lib"
        ? {
            compilerOptions: {
              baseUrl: "./",
              module: "esnext",
              moduleResolution: "bundler",
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              rootDir: "./src",
            },
            exclude: context.essentialsCommands
              ? [".next", "bin", "dist", "node_modules", "webpack.config.ts"]
              : [".next", "bin", "dist", "node_modules"],
            extends: context.essentialsCommands
              ? "./src/_out/tsconfig.base.json"
              : `${context.essentialsCommandsName}/tsconfig.json`,
            include: ["**/*.ts", "**/*.tsx"],
            "ts-node": context.essentialsCommands
              ? {
                  compilerOptions: { module: "commonjs" },
                  require: ["tsconfig-paths/register"],
                }
              : undefined,
          }
        : {
            compilerOptions: {
              baseUrl: "./",
              module: "esnext",
              moduleResolution: "bundler",
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              rootDir: "./src",
            },
            exclude: context.essentialsCommands
              ? [".next", "dist", "node_modules", "webpack.config.ts"]
              : [".next", "dist", "node_modules"],
            extends: context.essentialsCommands
              ? "./src/_out/tsconfig.base.json"
              : `${context.essentialsCommandsName}/tsconfig.json`,
            include: ["**/*.ts"],
            "ts-node": context.essentialsCommands
              ? {
                  compilerOptions: { module: "commonjs" },
                  require: ["tsconfig-paths/register"],
                }
              : undefined,
          };
}
