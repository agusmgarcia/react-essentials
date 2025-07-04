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
  const baseCompilerOptions = {
    allowJs: true,
    declaration: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    incremental: true,
    isolatedModules: true,
    jsx: "preserve",
    lib: ["DOM", "DOM.Iterable", "ESNext"],
    module: "esnext",
    moduleResolution: "bundler",
    noEmit: false,
    noImplicitOverride: true,
    plugins: [{ name: "next" }],
    resolveJsonModule: true,
    skipLibCheck: true,
    strict: true,
    target: "es2017",
    tsBuildInfoFile: "node_modules/.typescriptcache",
  };

  return context.core === "app"
    ? {
        compilerOptions: {
          ...baseCompilerOptions,
          baseUrl: "./",
          declaration: false,
          noEmit: true,
          paths: {
            "#public/*": ["public/*"],
            "#src/*": ["src/*"],
          },
        },
        exclude: [".next", "dist", "node_modules"],
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      }
    : context.core === "azure-func"
      ? {
          compilerOptions: {
            ...baseCompilerOptions,
            baseUrl: "./",
            declaration: false,
            outDir: "./dist",
            paths: {
              "#src/*": ["src/*"],
            },
            rootDir: "./src",
          },
          exclude: [".next", "dist", "node_modules"],
          include: ["**/*.ts"],
        }
      : context.core === "lib"
        ? {
            compilerOptions: {
              ...baseCompilerOptions,
              baseUrl: "./",
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              rootDir: "./src",
            },
            exclude: context.essentialsCommands
              ? [".next", "bin", "dist", "node_modules", "webpack.config.ts"]
              : [".next", "bin", "dist", "node_modules"],
            include: ["**/*.ts", "**/*.tsx"],
            "ts-node": context.essentialsCommands
              ? { compilerOptions: { module: "commonjs" } }
              : undefined,
          }
        : {
            compilerOptions: {
              ...baseCompilerOptions,
              baseUrl: "./",
              declaration: false,
              outDir: "./dist",
              paths: {
                "#src/*": ["src/*"],
              },
              rootDir: "./src",
            },
            exclude: [".next", "dist", "node_modules"],
            include: ["**/*.ts"],
          };
}
