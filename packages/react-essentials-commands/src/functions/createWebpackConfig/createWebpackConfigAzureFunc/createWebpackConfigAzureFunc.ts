import path from "path";
import getCustomTransformers from "ts-transform-paths";
import { type default as webpack } from "webpack";

import { type GetPackageJSONTypes } from "#src/functions";
import { folders } from "#src/modules";

import { type Input, type Output } from "./createWebpackConfigAzureFunc.types";

export default async function createWebpackConfigAzureFunc(
  input: Input,
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Output> {
  if (input[0] !== "azure-func") throw new Error("Unexpected scenario");

  return [
    {
      entry: await getFunctionEntries(packageJSON),
      externals: [
        ...Object.keys(packageJSON.dependencies || {}),
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
    .then((elements) =>
      elements.map(async (e) => {
        const folderPath = path.resolve("src", "functions", e);
        const isFolder = await folders.isFolder(folderPath);
        return { folderName: e, isFolder };
      }),
    )
    .then((elements) => Promise.all(elements))
    .then((elements) => elements.filter((e) => e.isFolder))
    .then((elements) => elements.map((e) => e.folderName))
    .then((folders) =>
      folders.reduce(
        (result, folder) => {
          result[folder] = {
            import: path.resolve("src", "functions", folder, "index.ts"),
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
            import: path.resolve("src", "functions", "index.ts"),
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
