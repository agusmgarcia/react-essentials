import path from "path";
import getCustomTransformers from "ts-transform-paths";
import { default as webpack } from "webpack";

import { folders, type GetPackageJSONTypes } from "#src/utils";

import { type Input, type Output } from "./createWebpackConfig.types";
import {
  getDependencies,
  NODE_DEPENDENCIES,
} from "./createWebpackConfig.utils";

export default async function createWebpackConfigLib(
  input: Input,
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Output> {
  if (input[0] !== "lib") throw new Error("Unexpected scenario");

  return [
    {
      entry: input[1]?.omit !== "web" ? await getOutEntries(packageJSON) : {},
      externals: [
        ...(await getDependencies(
          path.resolve("src"),
          path.resolve("src", "_bin"),
        )),
        "react/jsx-runtime",
        ...(typeof input[1]?.externals === "function"
          ? input[1].externals("web")
          : input[1]?.externals || []),
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  compilerOptions: {
                    declaration: true,
                    jsx: "react-jsx",
                    noEmit: false,
                  },
                  getCustomTransformers,
                },
              },
            ],
          },
          {
            exclude: /node_modules/,
            generator: {
              filename: path.join("dist", "_out", "[name].json"),
            },
            test: /src\/_out\/.+?\.json$/,
            type: "asset/resource",
          },
        ],
      },
      optimization: {
        nodeEnv: false,
      },
      output: {
        filename: (data) =>
          data.chunk?.name === "index"
            ? path.join("dist", "index.js")
            : path.join("dist", "_out", `${data.chunk?.name || "[name]"}.js`),
        globalObject: "this",
        libraryTarget: "umd",
        path: path.resolve("."),
        umdNamedDefine: true,
      },
      resolve: {
        alias: {
          "#src": path.resolve("src"),
          ...(typeof input[1]?.alias === "function"
            ? input[1].alias("web")
            : input[1]?.alias),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        fallback: NODE_DEPENDENCIES.reduce(
          (result, dependency) => {
            result[dependency] = false;
            return result;
          },
          {} as Record<string, false>,
        ),
      },
    },
    {
      entry: input[1]?.omit !== "node" ? await getOutEntries(packageJSON) : {},
      externals: [
        ...(await getDependencies(
          path.resolve("src"),
          path.resolve("src", "_bin"),
        )),
        "react/jsx-runtime",
        ...(typeof input[1]?.externals === "function"
          ? input[1].externals("node")
          : input[1]?.externals || []),
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  compilerOptions: {
                    declaration: input[1]?.omit === "web" ? true : false,
                    jsx: "react-jsx",
                    noEmit: false,
                  },
                  getCustomTransformers,
                },
              },
            ],
          },
          {
            exclude: /node_modules/,
            generator: {
              filename: path.join("dist", "_out", "[name].json"),
            },
            test: /src\/_out\/.+?\.json$/,
            type: "asset/resource",
          },
        ],
      },
      output: {
        filename: (data) =>
          data.chunk?.name === "index"
            ? path.join(
                "dist",
                `index${input[1]?.omit === "web" ? "" : ".node"}.js`,
              )
            : path.join(
                "dist",
                "_out",
                `${data.chunk?.name || "[name]"}${input[1]?.omit === "web" ? "" : ".node"}.js`,
              ),
        globalObject: "this",
        libraryTarget: "umd",
        path: path.resolve("."),
        umdNamedDefine: true,
      },
      resolve: {
        alias: {
          "#src": path.resolve("src"),
          ...(typeof input[1]?.alias === "function"
            ? input[1].alias("node")
            : input[1]?.alias),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      target: "node",
    },
    {
      entry: await getBinaryEntries(packageJSON),
      externals: [
        ...(await getDependencies(path.resolve("src", "_bin"))),
        "react/jsx-runtime",
        ...(typeof input[1]?.externals === "function"
          ? input[1].externals("binaries")
          : input[1]?.externals || []),
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
          {
            exclude: /node_modules/,
            test: /\.tsx?$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  compilerOptions: {
                    jsx: "react-jsx",
                    noEmit: false,
                  },
                  getCustomTransformers,
                },
              },
            ],
          },
        ],
      },
      optimization: {
        splitChunks: {
          chunks: "all",
        },
      },
      output: {
        filename: "[name].js",
        globalObject: "this",
        libraryTarget: "umd",
        path: path.resolve("bin"),
        umdNamedDefine: true,
      },
      plugins: [
        new webpack.BannerPlugin({
          banner: "#! /usr/bin/env node",
          raw: true,
        }),
      ],
      resolve: {
        alias: {
          "#src": path.resolve("src"),
          ...(typeof input[1]?.alias === "function"
            ? input[1].alias("binaries")
            : input[1]?.alias),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      target: "node",
    },
  ];
}

async function getOutEntries(
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Record<string, webpack.EntryObject[string]>> {
  return await folders
    .readFolder(path.resolve("src", "_out"))
    .then((fs) =>
      fs.filter(
        (f) =>
          !f.startsWith("_") &&
          (f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".json")),
      ),
    )
    .then((files) =>
      files.reduce(
        (result, file) => {
          const fileName = file.endsWith(".ts")
            ? file.split(".ts")[0]
            : file.endsWith(".tsx")
              ? file.split(".tsx")[0]
              : file.split(".json")[0];

          result[fileName] = file.endsWith(".json")
            ? path.resolve("src", "_out", file)
            : {
                import: path.resolve("src", "_out", file),
                library: {
                  name: `${packageJSON.name}/[name]`,
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

async function getBinaryEntries(
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Record<string, webpack.EntryObject[string]>> {
  return await folders
    .readFolder(path.resolve("src", "_bin"))
    .then((files) =>
      files.filter((file) => !file.startsWith("_") && file.endsWith(".ts")),
    )
    .then((files) =>
      files.reduce(
        (result, file) => {
          result[file.split(".ts")[0]] = {
            import: path.resolve("src", "_bin", file),
            library: {
              name: `${packageJSON.name}/_bin/[name]`,
              type: "umd",
              umdNamedDefine: true,
            },
          };

          return result;
        },
        {} as Record<string, webpack.EntryObject[string]>,
      ),
    );
}
