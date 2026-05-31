import path from "path";
import getCustomTransformers from "ts-transform-paths";
import { default as webpack } from "webpack";

import { type GetPackageJSONTypes } from "#src/functions";
import { folders } from "#src/outputs/folders";

import { type Input, type Output } from "./createWebpackConfigLib.types";
import { NODE_DEPENDENCIES } from "./createWebpackConfigLib.utils";

export default async function createWebpackConfigLib(
  input: Input & { core: "lib" },
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Output> {
  return [
    {
      entry: await getOutEntries(packageJSON),
      externals: [
        ...Object.keys(packageJSON.dependencies || {}),
        ...Object.keys(packageJSON.peerDependencies || {}),
        ...(input?.externals || []),
        "react/jsx-runtime",
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
              filename: path.join("dist", "outputs", "[name].json"),
            },
            test: /src\/outputs\/.+?\.json$/,
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
            : path.join(
                "dist",
                "outputs",
                data.chunk?.name || "[name]",
                "index.js",
              ),
        globalObject: "this",
        libraryTarget: "umd",
        path: path.resolve("."),
        umdNamedDefine: true,
      },
      resolve: {
        alias: {
          "#src": path.resolve("src"),
          ...(typeof input?.alias === "function"
            ? input.alias("web")
            : input?.alias),
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
      entry: await getOutEntries(packageJSON),
      externals: [
        ...Object.keys(packageJSON.dependencies || {}),
        ...Object.keys(packageJSON.peerDependencies || {}),
        ...(input?.externals || []),
        "react/jsx-runtime",
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
                    declaration: false,
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
              filename: path.join("dist", "outputs", "[name].json"),
            },
            test: /src\/outputs\/.+?\.json$/,
            type: "asset/resource",
          },
        ],
      },
      output: {
        filename: (data) =>
          data.chunk?.name === "index"
            ? path.join("dist", "index.node.js")
            : path.join(
                "dist",
                "outputs",
                data.chunk?.name || "[name]",
                "index.node.js",
              ),
        globalObject: "this",
        libraryTarget: "umd",
        path: path.resolve("."),
        umdNamedDefine: true,
      },
      resolve: {
        alias: {
          "#src": path.resolve("src"),
          ...(typeof input?.alias === "function"
            ? input.alias("node")
            : input?.alias),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      target: "node",
    },
    {
      entry: await getBinaryEntries(packageJSON),
      externals: [
        ...Object.keys(packageJSON.dependencies || {}),
        ...Object.keys(packageJSON.peerDependencies || {}),
        ...(input?.externals || []),
        "react/jsx-runtime",
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
          ...(typeof input?.alias === "function"
            ? input.alias("node")
            : input?.alias),
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
    .readFolder(path.resolve("src", "outputs"))
    .then((files) =>
      files.map(async (file) => {
        if (file.endsWith(".json"))
          return { [file]: path.resolve("src", "outputs", file) };

        if (
          !(await folders
            .readFolder(path.resolve("src", "outputs", file))
            .then((files) => files.includes("index.ts")))
        )
          return undefined;

        return {
          [file]: {
            import: path.resolve("src", "outputs", file, "index.ts"),
            library: {
              name: `${packageJSON.name}/[name]`,
              type: "umd",
              umdNamedDefine: true,
            },
          },
        };
      }),
    )
    .then((promises) => Promise.all(promises))
    .then((entries) => entries.filter((e) => !!e))
    .then((entries) =>
      entries.reduce((result, entry) => ({ ...entry, ...result }), {
        index: {
          import: path.resolve("src", "index.ts"),
          library: {
            name: packageJSON.name,
            type: "umd",
            umdNamedDefine: true,
          },
        },
      } as Record<string, webpack.EntryObject[string]>),
    );
}

async function getBinaryEntries(
  packageJSON: GetPackageJSONTypes.Response,
): Promise<Record<string, webpack.EntryObject[string]>> {
  return await folders
    .readFolder(path.resolve("src", "binaries"))
    .then((files) =>
      files.filter(
        (file) => file.endsWith(".ts") && !file.endsWith(".test.ts"),
      ),
    )
    .then((files) =>
      files.reduce(
        (result, file) => {
          result[file.split(".ts")[0]] = {
            import: path.resolve("src", "binaries", file),
            library: {
              name: `${packageJSON.name}/binaries/[name]`,
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
