import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigNextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigNextTypescript from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { projectStructurePlugin } from "eslint-plugin-project-structure";
import eslintPluginSort from "eslint-plugin-sort";
import path from "path";
import process from "process";

import { files, npm } from "#src/modules";

import { type Input, type Output } from "./createEslintConfig.types";
import { eslintFileComposition } from "./eslintFileComposition";
import { eslintFolderStructure } from "./eslintFolderStructure";
import { eslintIndependentModules } from "./eslintIndependentModules";

/**
 * Generates an ESLint configuration object tailored for React and TypeScript projects,
 * supporting Next.js, import sorting, and unused import detection.
 *
 * @param core - The core mode for the project, typically "app" or another string.
 *               Determines whether certain Next.js rules are enabled.
 * @returns An ESLint configuration object compatible with the flat config API.
 */
export default async function createEslintConfig(
  ...[core]: Input
): Promise<Output> {
  const [monorepoDetails, tsconfig] = await Promise.all([
    npm.getMonorepoDetails(),
    files
      .readFile(path.resolve(process.cwd(), "tsconfig.json"))
      .then((tsconfig) => (tsconfig ? JSON.parse(tsconfig) : undefined)),
  ]);

  return defineConfig([
    // project-structure
    {
      files: ["**/*.js", "**/*.ts", "**/*.tsx"],
      plugins: {
        "project-structure": projectStructurePlugin,
      },
      rules: {
        "project-structure/file-composition": [
          "error",
          core === "app"
            ? eslintFileComposition.APP
            : core === "azure-func"
              ? eslintFileComposition.AZURE_FUNC
              : core === "lib"
                ? eslintFileComposition.LIB
                : eslintFileComposition.NODE,
        ],

        "project-structure/folder-structure": [
          "error",
          core === "app"
            ? eslintFolderStructure.APP
            : core === "azure-func"
              ? eslintFolderStructure.AZURE_FUNC
              : core === "lib"
                ? eslintFolderStructure.LIB
                : eslintFolderStructure.NODE,
        ],

        "project-structure/independent-modules": [
          "error",
          core === "app"
            ? eslintIndependentModules.createApp(
                monorepoDetails?.location,
                tsconfig?.compilerOptions?.paths,
              )
            : core === "azure-func"
              ? eslintIndependentModules.createAzureFunc(
                  monorepoDetails?.location,
                  tsconfig?.compilerOptions?.paths,
                )
              : core === "lib"
                ? eslintIndependentModules.createLib(
                    monorepoDetails?.location,
                    tsconfig?.compilerOptions?.paths,
                  )
                : eslintIndependentModules.createNode(
                    monorepoDetails?.location,
                    tsconfig?.compilerOptions?.paths,
                  ),
        ],
      },
      settings: {
        "project-structure/cache-location": "./node_modules",
      },
    },

    // prettier
    eslintPluginPrettierRecommended,
    {
      rules: {
        "prettier/prettier": "error",
      },
    },

    // sort
    eslintPluginSort.configs["flat/recommended"],
    {
      rules: {
        "sort/destructuring-properties": "error",
        "sort/export-members": "error",
        "sort/exports": [
          "error",
          {
            caseSensitive: false,
            groups: [
              { order: 5, type: "default" },
              { order: 4, type: "sourceless" },
              { order: 3, regex: "^\\.+\\/" },
              { order: 1, type: "dependency" },
              { order: 1, regex: "^@.+?\\/.+?$" },
              { order: 2, type: "other" },
            ],
            natural: true,
          },
        ],
        "sort/import-members": "error",
        "sort/imports": [
          "error",
          {
            caseSensitive: false,
            groups: [
              { order: 1, type: "side-effect" },
              { order: 4, regex: "^\\.+\\/" },
              { order: 2, type: "dependency" },
              { order: 2, regex: "^@.+?\\/.+?$" },
              { order: 3, type: "other" },
            ],
            natural: true,
            separator: "\n",
          },
        ],
        "sort/object-properties": "error",
        "sort/string-enums": [
          "error",
          {
            caseSensitive: false,
            natural: true,
          },
        ],
        "sort/string-unions": [
          "error",
          {
            caseSensitive: false,
            natural: true,
          },
        ],
        "sort/type-properties": [
          "error",
          {
            caseSensitive: false,
            natural: true,
          },
        ],
      },
    },

    // @next
    ...eslintConfigNextCoreWebVitals,
    {
      rules: {
        "@next/next/no-html-link-for-pages": core === "app" ? "error" : "off",
      },
    },

    // react
    {
      rules: {
        "react/jsx-boolean-value": ["error", "always"],
        "react/jsx-sort-props": ["error", { reservedFirst: true }],
      },
    },

    // @typescript-eslint
    ...eslintConfigNextTypescript,
    {
      rules: {
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            disallowTypeAnnotations: true,
            fixStyle: "inline-type-imports",
            prefer: "type-imports",
          },
        ],
        "@typescript-eslint/no-empty-object-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-unsafe-function-type": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            vars: "all",
            varsIgnorePattern: "^_",
          },
        ],
      },
    },

    // Global Ignores
    globalIgnores([
      "**/.next",
      "**/bin",
      "**/dist",
      "**/package.json",
      "**/node_modules",
      "**/*.d.ts",
    ]),
  ]);
}
