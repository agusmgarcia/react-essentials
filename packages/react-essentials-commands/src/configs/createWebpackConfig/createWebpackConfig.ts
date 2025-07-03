import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import getCustomTransformers from "ts-transform-paths";
import { default as webpack } from "webpack";

import packageJSONEssentialsCommands from "../../../package.json";
import { folders, getPackageJSON, npm } from "../../utils"; // TODO: see how to convert it into #src/utils
import { type Input, type Output } from "./createWebpackConfig.types";

/**
 * Asynchronously generates a Webpack configuration array based on the provided core type and configuration options.
 *
 * This function supports multiple build targets, including Azure Functions, libraries (with optional web/node outputs),
 * and CLI binaries. It dynamically constructs entry points, externals, module rules, output settings, plugins, and resolve options
 * according to the detected project structure and provided configuration.
 *
 * @param core - The build target type, such as "azure-func" or "lib".
 * @param configs - Optional configuration overrides and additional settings.
 * @returns A Promise that resolves to an array of Webpack configuration objects tailored to the specified build target.
 *
 * @remarks
 * - For "azure-func", it creates entries for each function in `src/functions` and an index entry.
 * - For "lib", it can output both web and node builds, and optionally CLI binaries from `src/_bin`.
 * - Handles TypeScript and CSS processing, and manages externals based on dependencies and peerDependencies.
 * - Applies custom TypeScript path transformers and supports UMD library output.
 */
export default async function createWebpackConfig(
  ...[core, configs]: Input
): Promise<Output> {
  const [packageJSON, react] = await Promise.all([
    getPackageJSON(),
    npm.isDependencyInstalled("react", { peer: true }),
  ]);

  if (core === "azure-func") {
    const functions = await folders
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
            result[file.split(".ts")[0]] = path.resolve(
              "src",
              "functions",
              file,
            );
            return result;
          },
          {} as Record<string, string>,
        ),
      );

    return [
      {
        entry: {
          index: path.resolve("src", "index.ts"),
          ...functions,
        },
        externals: [
          ...Object.keys(packageJSON.dependencies || {}),
          ...(configs?.externals || []),
        ],
        module: {
          rules: [
            {
              exclude: /node_modules/,
              test: /\.ts$/,
              use: [
                {
                  loader: "ts-loader",
                  options: { getCustomTransformers },
                },
              ],
            },
          ],
        },
        output: {
          filename: (data) =>
            data.chunk?.name === "index"
              ? "index.js"
              : `functions${path.sep}${data.chunk?.name || "[name]"}.js`,
          globalObject: "this",
          library: {
            name: packageJSON.name,
            type: "umd",
          },
          path: path.resolve("dist"),
          umdNamedDefine: true,
        },
        resolve: {
          alias: { "#src": path.resolve("src") },
          extensions: [".js", ".ts"],
        },
        target: "node",
        watchOptions: {
          ignored: /node_modules/,
        },
      },
    ];
  }

  if (core === "lib") {
    const outs = await folders
      .readFolder(path.resolve("src", "_out"))
      .then((fs) => fs.filter((f) => !f.startsWith("_") && f.endsWith(".ts")))
      .then((files) =>
        files.reduce(
          (result, file) => {
            result[file.split(".ts")[0]] = path.resolve("src", "_out", file);
            return result;
          },
          {} as Record<string, string>,
        ),
      );

    return [
      {
        entry:
          configs?.omit !== "web"
            ? { index: path.resolve("src", "index.ts"), ...outs }
            : {},
        externals: [
          ...Object.keys(packageJSON.peerDependencies || {}),
          react ? "react/jsx-runtime" : "",
          ...(configs?.externals || []),
        ].filter((i) => !!i),
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                "style-loader",
                "css-loader",
                "postcss-loader",
              ],
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
              ? `dist${path.sep}index.js`
              : `dist${path.sep}_out${path.sep}${data.chunk?.name || "[name]"}.js`,
          globalObject: "this",
          library: {
            name: packageJSON.name,
            type: "umd",
          },
          path: path.resolve("."),
          umdNamedDefine: true,
        },
        plugins: [new MiniCssExtractPlugin()],
        resolve: {
          alias: { "#src": path.resolve("src") },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          fallback: {
            assert: false,
            buffer: false,
            child_process: false,
            console: false,
            constants: false,
            crypto: false,
            domain: false,
            events: false,
            fs: false,
            http: false,
            https: false,
            os: false,
            path: false,
            process: false,
            punycode: false,
            querystring: false,
            readline: false,
            stream: false,
            string_decoder: false,
            sys: false,
            timers: false,
            tty: false,
            url: false,
            util: false,
            vm: false,
            zlib: false,
          },
        },
      },
      {
        entry:
          configs?.omit !== "node"
            ? { index: path.resolve("src", "index.ts"), ...outs }
            : {},
        externals: [
          ...Object.keys(packageJSON.peerDependencies || {}),
          react ? "react/jsx-runtime" : "",
          ...(configs?.externals || []),
        ].filter((i) => !!i),
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                "style-loader",
                "css-loader",
                "postcss-loader",
              ],
            },
            {
              exclude: /node_modules/,
              test: /\.tsx?$/,
              use: [
                {
                  loader: "ts-loader",
                  options: {
                    compilerOptions: {
                      declaration: configs?.omit === "web" ? true : false,
                      jsx: "react-jsx",
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
              ? `dist${path.sep}index${configs?.omit === "web" ? "" : ".node"}.js`
              : `dist${path.sep}_out${path.sep}${data.chunk?.name || "[name]"}${configs?.omit === "web" ? "" : ".node"}.js`,
          globalObject: "this",
          library: {
            name: packageJSON.name,
            type: "umd",
          },
          path: path.resolve("."),
          umdNamedDefine: true,
        },
        plugins: [new MiniCssExtractPlugin()],
        resolve: {
          alias: { "#src": path.resolve("src") },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        target: "node",
      },
      {
        entry: await folders
          .readFolder(path.resolve("src", "_bin"))
          .then((files) =>
            files.filter(
              (file) => !file.startsWith("_") && file.endsWith(".ts"),
            ),
          )
          .then((files) =>
            files.reduce(
              (result, file) => {
                result[file.split(".ts")[0]] = path.resolve(
                  "src",
                  "_bin",
                  file,
                );
                return result;
              },
              {} as Record<string, string>,
            ),
          ),
        externals: [
          ...Object.keys(packageJSON.peerDependencies || {}),
          react ? "react/jsx-runtime" : "",
          ...(configs?.externals || []),
        ].filter((i) => !!i),
        module: {
          rules: [
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
          library: {
            name: packageJSON.name,
            type: "umd",
          },
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
          alias: { "#src": path.resolve("src") },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        target: "node",
      },
    ];
  }

  return [
    {
      entry: path.resolve("src", "index.ts"),
      externals: [
        ...Object.keys(packageJSON.dependencies || {}),
        ...(configs?.externals || []),
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
                options: { getCustomTransformers },
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
        },
        path: path.resolve("dist"),
        umdNamedDefine: true,
      },
      resolve: {
        alias: { "#src": path.resolve("src") },
        extensions: [".js", ".ts"],
      },
      target: "node",
      watchOptions: {
        ignored: /node_modules/,
      },
    },
  ];
}
