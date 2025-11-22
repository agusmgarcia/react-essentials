import path from "path";
import getCustomTransformers from "ts-transform-paths";
import { type default as webpack } from "webpack";

import { folders, type GetPackageJSONTypes } from "#src/utils";

import { type Input, type Output } from "./createWebpackConfig.types";
import { getDependencies } from "./createWebpackConfig.utils";

export default async function createWebpackConfigAzureFunc(
  input: Input,
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Output> {
  if (input[0] !== "azure-func") throw new Error("Unexpected scenario");

  return [
    {
      entry: await getFunctionEntries(packageJSON),
      externals: [
        ...(await getDependencies(path.resolve("src"))),
        ...(input[1]?.externals || []),
      ],
      module: {
        rules: [
          {
            exclude: /node_modules/,
            test: /\.ts$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  compilerOptions: {
                    noEmit: false,
                  },
                  getCustomTransformers,
                },
              },
            ],
          },
        ],
      },
      output: {
        filename: (data) =>
          data.chunk?.name === "index"
            ? "index.js"
            : path.join("functions", `${data.chunk?.name || "[name]"}.js`),
        globalObject: "this",
        libraryTarget: "umd",
        path: path.resolve("dist"),
        umdNamedDefine: true,
      },
      resolve: {
        alias: {
          "#src": path.resolve("src"),
          ...input[1]?.alias,
        },
        extensions: [".js", ".ts"],
      },
      target: "node",
      watchOptions: {
        ignored: /node_modules/,
      },
    },
  ];
}

async function getFunctionEntries(
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Record<string, webpack.EntryObject[string]>> {
  return await folders
    .readFolder(path.resolve("src", "functions"))
    .then((files) =>
      files.filter(
        (file) =>
          !file.startsWith("_") &&
          !file.endsWith(".test.ts") &&
          file.endsWith(".ts") &&
          file !== "index.ts",
      ),
    )
    .then((files) =>
      files.reduce(
        (result, file) => {
          result[file.split(".ts")[0]] = {
            import: path.resolve("src", "functions", file),
            library: {
              name: `${packageJSON.name}/functions/[name]`,
              type: "umd",
              umdNamedDefine: true,
            },
          };
          return result;
        },
        {
          index: {
            import: path.resolve("src", "index.ts"),
            library: {
              name: packageJSON.name,
              type: "umd",
              umdNamedDefine: true,
            },
          },
        } as Record<string, webpack.EntryObject[string]>,
      ),
    );
}
