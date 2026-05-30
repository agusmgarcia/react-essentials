import path from "path";
import getCustomTransformers from "ts-transform-paths";

import { type GetPackageJSONTypes } from "#src/functions";

import packageJSONEssentialsCommands from "../../../../package.json";
import { type Input, type Output } from "./createWebpackConfigNode.types";

export default async function createWebpackConfigNode(
  input: Input & { core: "node" },
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Output> {
  return [
    {
      entry: path.resolve("src", "index.ts"),
      externals: [
        ...Object.keys(packageJSON.dependencies || {}),
        ...(input?.externals || []),
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
                  "outputs",
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
          ...(typeof input?.alias === "function"
            ? input.alias("node")
            : input?.alias),
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
