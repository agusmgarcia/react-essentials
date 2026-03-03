import { properties } from "#src/modules";

import { type Context, createFileMiddleware } from "../middlewares.utils";

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
          jsx: "react-jsx",
          module: "esnext",
          moduleResolution: "bundler",
          paths: {
            "#public/*": ["public/*"],
            "#src/*": ["src/*"],
          },
        },
        exclude: ["*.ts", ".next", "dist", "node_modules"],
        extends: context.essentialsCommands
          ? "./src/outputs/tsconfig.base.json"
          : `${context.essentialsCommandsName}/tsconfig.json`,
        include: [
          "next-env.d.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
          ".next/dev/types/**/*.ts",
        ],
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
          exclude: ["*.ts", ".next", "dist", "node_modules"],
          extends: context.essentialsCommands
            ? "./src/outputs/tsconfig.base.json"
            : `${context.essentialsCommandsName}/tsconfig.json`,
          include: ["**/*.ts"],
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
            exclude: ["*.ts", ".next", "bin", "dist", "node_modules"],
            extends: context.essentialsCommands
              ? "./src/outputs/tsconfig.base.json"
              : `${context.essentialsCommandsName}/tsconfig.json`,
            include: ["**/*.ts", "**/*.tsx"],
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
            exclude: ["*.ts", ".next", "dist", "node_modules"],
            extends: context.essentialsCommands
              ? "./src/outputs/tsconfig.base.json"
              : `${context.essentialsCommandsName}/tsconfig.json`,
            include: ["**/*.ts"],
          };
}
