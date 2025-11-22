import path from "path";
import getCustomTransformers from "ts-transform-paths";

import { type GetPackageJSONTypes } from "#src/utils";

import packageJSONEssentialsCommands from "../../../package.json";
import { type Input, type Output } from "./createWebpackConfig.types";
import { getDependencies } from "./createWebpackConfig.utils";

export default async function createWebpackConfigNode(
  input: Input,
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Output> {
  if (input[0] !== "node") throw new Error("Unexpected scenario");

  return [
    {
      entry: path.resolve("src", "index.ts"),
      externals: [
        ...(await getDependencies(path.resolve("src"))),
        ...(input[1]?.externals || []),
      ],
      module: {
        rules: [
          {
            exclude: /node_modules/,
            test: (resource) => resource === path.resolve("src", "index.ts"),
            use: [
              {
                loader: path.resolve(
                  "node_modules",
                  packageJSONEssentialsCommands.name,
                  "dist",
                  "_out",
                  "LoadEnvConfigLoader.js",
                ),
              },
            ],
          },
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
        filename: "index.js",
        globalObject: "this",
        library: {
          name: packageJSON.name,
          type: "umd",
          umdNamedDefine: true,
        },
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
