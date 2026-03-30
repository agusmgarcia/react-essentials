import {
  createFileComposition,
  createFolderStructure,
  createIndependentModules,
} from "eslint-plugin-project-structure";
import process from "process";

const PRIVATE_FILE_ROOTS_COMPOSITION: Parameters<
  typeof createFileComposition
>[0]["filesRules"][number]["rules"] = [
  {
    format: "{camelCase}",
    scope: "nestedSelectors",
    selector: ["function", "arrowFunction"],
  },
  {
    format: ["{camelCase}", "{SNAKE_CASE}"],
    scope: "nestedSelectors",
    selector: ["variable", "propertyDefinition", "variableExpression"],
  },
  {
    format: "{PascalCase}",
    scope: "nestedSelectors",
    selector: ["type", "class"],
  },
  {
    format: "{camelCase}",
    scope: "fileRoot",
    selector: ["function"],
  },
  {
    format: ["{camelCase}", "{SNAKE_CASE}"],
    scope: "fileRoot",
    selector: ["variable", "variableExpression"],
  },
  {
    format: "{PascalCase}",
    scope: "fileRoot",
    selector: ["type", "class"],
  },
];

export const APP_FOLDER_STRUCTURE = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{folderName}.json" },
        { name: "{folderName}.ts" },
        { name: "{folderName}.test.ts" },
        { name: "{folderName}.types.ts" },
        { name: "{folderName}.utils.ts" },
        { name: "{folderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{nodeName}.ts", "{nodeName}.types.ts"],
    },
    _pascal_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.json" },
        { name: "{FolderName}.ts" },
        { name: "{FolderName}.test.ts" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.utils.ts" },
        { name: "{FolderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
    },
    clients_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}Client", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    component_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.hooks.ts" },
        { name: "{FolderName}.hooks.test.ts" },
        { name: "{FolderName}.json" },
        { name: "{FolderName}.tsx" },
        { name: "{FolderName}.test.tsx" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.utils.ts" },
        { name: "{FolderName}.utils.test.ts" },
        { name: "{FolderName}(.module)?.(sass|css|scss)" },
        { name: "{PascalCase}", ruleId: "component_folder" },
      ],
      enforceExistence: [
        "index.ts",
        "{NodeName}.hooks.ts",
        "{NodeName}.tsx",
        "{NodeName}.types.ts",
      ],
    },
    components_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}", ruleId: "component_folder" },
      ],
      enforceExistence: "index.ts",
    },
    fragments_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}", ruleId: "component_folder" },
      ],
      enforceExistence: "index.ts",
    },
    page_folder: {
      children: [
        { name: "{kebab-case}.tsx" },
        { name: "\\[{kebab-case}\\].tsx" },
        { name: "\\[...{kebab-case}\\].tsx" },
        { name: "{kebab-case}", ruleId: "page_folder" },
        { name: "\\[{kebab-case}\\]", ruleId: "page_folder" },
        { name: "\\[...{kebab-case}\\]", ruleId: "page_folder" },
        { name: "\\[\\[...{kebab-case}\\]\\]", ruleId: "page_folder" },
      ],
    },
    pages_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}", ruleId: "component_folder" },
      ],
      enforceExistence: "index.ts",
    },
    store_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}Slice", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    utils_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
  },
  structure: {
    children: [
      { name: "eslint.config.js" },
      { name: "jest.config.js" },
      { name: "next-env.d.ts" },
      { name: "next.config.js" },
      { name: "package.json" },
      {
        children: [
          { name: "_app.tsx" },
          { name: "_app.css" },
          { name: "_document.tsx" },
          { name: "{kebab-case}.tsx" },
          { name: "\\[{kebab-case}\\].tsx" },
          { name: "\\[...{kebab-case}\\].tsx" },
          { name: "{kebab-case}", ruleId: "page_folder" },
          { name: "\\[{kebab-case}\\]", ruleId: "page_folder" },
          { name: "\\[...{kebab-case}\\]", ruleId: "page_folder" },
          { name: "\\[\\[...{kebab-case}\\]\\]", ruleId: "page_folder" },
        ],
        name: "pages",
      },
      { name: "postcss.config.js" },
      { name: "prettier.config.js" },
      { name: "public" },
      {
        children: [
          { name: "clients", ruleId: "clients_folder" },
          { name: "components", ruleId: "components_folder" },
          { name: "fragments", ruleId: "fragments_folder" },
          { name: "pages", ruleId: "pages_folder" },
          { name: "store", ruleId: "store_folder" },
          { name: "utils", ruleId: "utils_folder" },
        ],
        name: "src",
      },
      { name: "tsconfig.json" },
    ],
    enforceExistence: [
      "eslint.config.js",
      "jest.config.js",
      "next-env.d.ts",
      "next.config.js",
      "package.json",
      "pages",
      "postcss.config.js",
      "prettier.config.js",
      "public",
      "src",
      "tsconfig.json",
    ],
  },
});

export function createAppIndependentModules(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      // <============================= PAGES =============================> //
      {
        allowImportsFrom: ["public/**/*"],
        name: "pages/_document.tsx",
        pattern: "pages/_document.tsx",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "pages/_app.css",
          "src/clients/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
        ],
        name: "pages/_app.tsx",
        pattern: "pages/_app.tsx",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
        ],
        name: "pages/**/*.tsx",
        pattern: "pages/**/*.tsx",
      },

      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/*/index.ts",
        pattern: "src/*/index.ts",
      },
      {
        allowImportsFrom: ["{element}", "{dirname}/*.types.ts"],
        name: "src/*/*/**/index.ts",
        pattern: "src/*/*/**/index.ts",
      },

      // <============================ CLIENTS ============================> //
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.types.ts",
        pattern: "src/clients/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.ts",
        pattern: "src/clients/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.test.ts",
        pattern: "src/clients/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.test.ts",
        pattern: "src/clients/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.ts",
        pattern: "src/clients/*/**/*.ts",
      },

      // <========================== COMPONENTS ===========================> //
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/utils/index.ts",
          "{hooksFileAccessPaths}",
        ],
        name: "src/components/*/**/*.hooks.ts",
        pattern: "src/components/*/**/*.hooks.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/utils/index.ts",
          "{hooksTestFileAccessPaths}",
        ],
        name: "src/components/*/**/*.hooks.test.ts",
        pattern: "src/components/*/**/*.hooks.test.ts",
      },
      {
        allowImportsFrom: [
          "src/components/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/components/*/**/*.types.ts",
        pattern: "src/components/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/components/*/**/*.utils.ts",
        pattern: "src/components/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/components/*/**/*.utils.test.ts",
        pattern: "src/components/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/components/*/**/*.test.tsx",
        pattern: "src/components/*/**/*.test.tsx",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/components/*/**/*.tsx",
        pattern: "src/components/*/**/*.tsx",
      },

      // <========================== FRAGMENTS ============================> //
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{hooksFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.hooks.ts",
        pattern: "src/fragments/*/**/*.hooks.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{hooksTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.hooks.test.ts",
        pattern: "src/fragments/*/**/*.hooks.test.ts",
      },
      {
        allowImportsFrom: [
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.types.ts",
        pattern: "src/fragments/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.utils.ts",
        pattern: "src/fragments/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.utils.test.ts",
        pattern: "src/fragments/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.test.tsx",
        pattern: "src/fragments/*/**/*.test.tsx",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.tsx",
        pattern: "src/fragments/*/**/*.tsx",
      },

      // <============================ PAGES ==============================> //
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{hooksFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.hooks.ts",
        pattern: "src/pages/*/**/*.hooks.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{hooksTestFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.hooks.test.ts",
        pattern: "src/pages/*/**/*.hooks.test.ts",
      },
      {
        allowImportsFrom: [
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.types.ts",
        pattern: "src/pages/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.utils.ts",
        pattern: "src/pages/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.utils.test.ts",
        pattern: "src/pages/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.test.tsx",
        pattern: "src/pages/*/**/*.test.tsx",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/components/index.ts",
          "src/fragments/index.ts",
          "src/pages/index.ts",
          "src/store/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/pages/*/**/*.tsx",
        pattern: "src/pages/*/**/*.tsx",
      },

      // <============================ STORE ==============================> //
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/store/index.ts",
          "{slice}",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/store/*/**/*.types.ts",
        pattern: "src/store/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/store/index.ts",
          "{slice}",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/store/*/**/*.utils.ts",
        pattern: "src/store/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/store/index.ts",
          "{slice}",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/store/*/**/*.utils.test.ts",
        pattern: "src/store/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/store/index.ts",
          "{slice}",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/store/*/**/*.test.ts",
        pattern: "src/store/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "src/store/index.ts",
          "{slice}",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/store/*/**/*.ts",
        pattern: "src/store/*/**/*.ts",
      },

      // <============================ UTILS ==============================> //
      {
        allowImportsFrom: ["src/utils/index.ts", "{typesFileAccessPaths}"],
        name: "src/utils/*/**/*.types.ts",
        pattern: "src/utils/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.utils.ts",
        pattern: "src/utils/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.utils.test.ts",
        pattern: "src/utils/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.test.ts",
        pattern: "src/utils/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.ts",
        pattern: "src/utils/*/**/*.ts",
      },
    ],
    packageRoot: location,
    pathAliases: location
      ? {
          baseUrl: location,
          paths: paths || {},
        }
      : undefined,
    reusableImportPatterns: {
      element: [
        "{dirname}/*.ts?(x)",
        "!{dirname}/*.hooks.ts",
        "!{dirname}/*.hooks.test.ts",
        "!{dirname}/*.test.ts?(x)",
        "!{dirname}/*.types.ts",
        "!{dirname}/*.utils.ts",
        "!{dirname}/*.utils.test.ts",
      ],
      elementFileAccessPaths: [
        "./package.json",
        "{dirname}/*.hooks.ts",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*?(.module).@(sass|css|scss)",
        "{dirname}/*/index.ts",
      ],
      elementTestFileAccessPaths: [
        "./package.json",
        "{element}",
        "{dirname}/*.hooks.ts",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      hooksFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      hooksTestFileAccessPaths: [
        "./package.json",
        "{dirname}/*.hooks.ts",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      slice: [
        "src/store/*.ts",
        "!src/store/*.types.ts",
        "!src/store/*.utils.ts",
        "!src/store/*.utils.test.ts",
      ],
      typesFileAccessPaths: ["./package.json", "{dirname}/*/index.ts"],
      utilsFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*/index.ts",
      ],
      utilsTestFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export const APP_FILE_COMPOSITION = createFileComposition({
  filesRules: [
    // <============================== PAGES ==============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "pages/_app.tsx",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "App",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: { limitTo: "dynamic", type: "variableExpression" },
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [["pages/**/*.tsx", "!pages/_document.tsx"]],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: { limitTo: "dynamic", type: "variableExpression" },
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================= CLIENTS =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/clients/*/*.types.ts",
      rootSelectorsLimits: [{ limit: { min: 2 }, selector: "type" }],
      rules: [
        {
          format: ["{PascalCase}Request", "{PascalCase}Response"],
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        [
          "src/clients/*/*.ts",
          "!src/clients/*/index.ts",
          "!src/clients/*/*.test.ts",
          "!src/clients/*/*.utils.ts",
        ],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "class" }],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================ COMPONENTS ===========================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        "src/components/*/**/*.hooks.ts",
        "src/fragments/*/**/*.hooks.ts",
        "src/pages/*/**/*.hooks.ts",
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          filenamePartsToRemove: ".hooks",
          format: "use{FileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        "src/components/*/**/*.types.ts",
        "src/fragments/*/**/*.types.ts",
        "src/pages/*/**/*.types.ts",
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "type" }],
      rules: [
        {
          filenamePartsToRemove: ".types",
          format: "{FileName}Props",
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        ["src/components/*/**/*.tsx", "!src/components/*/**/*.test.tsx"],
        ["src/fragments/*/**/*.tsx", "!src/fragments/*/**/*.test.tsx"],
        ["src/pages/*/**/*.tsx", "!src/pages/*/**/*.test.tsx"],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: { limitTo: "dynamic", type: "variableExpression" },
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================== STORE ==============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/store/index.ts",
      rootSelectorsLimits: [
        { limit: { min: 1 }, selector: "type" },
        { limit: { min: 1 }, selector: "function" },
        { limit: { max: 3, min: 3 }, selector: "variableExpression" },
      ],
      rules: [
        {
          format: "{PascalCase}",
          positionIndex: 0,
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "reactStore",
          positionIndex: 1,
          scope: "fileRoot",
          selector: {
            limitTo: "createReactStore",
            type: "variableExpression",
          },
        },
        {
          format: "StoreProvider",
          positionIndex: 2,
          scope: "fileExport",
          selector: {
            limitTo: "reactStore",
            type: "variableExpression",
          },
        },
        {
          format: "useSelector",
          positionIndex: 3,
          scope: "fileRoot",
          selector: {
            limitTo: "reactStore",
            type: "variableExpression",
          },
        },
        {
          format: "use{PascalCase}",
          positionIndex: 4,
          scope: "fileExport",
          selector: "function",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        [
          "src/store/*/*.ts",
          "!src/store/*/index.ts",
          "!src/store/*/*.test.ts",
          "!src/store/*/*.types.ts",
          "!src/store/*/*.utils.ts",
        ],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "class" }],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================= GENERAL =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/*/**/*.utils.ts",
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{camelCase}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{camelCase}", "{SNAKE_CASE}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{fileName}", "{FILE_NAME}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
  ],
  projectRoot: process.cwd(),
});

export const AZURE_FUNC_FOLDER_STRUCTURE = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{folderName}.json" },
        { name: "{folderName}.ts" },
        { name: "{folderName}.test.ts" },
        { name: "{folderName}.types.ts" },
        { name: "{folderName}.utils.ts" },
        { name: "{folderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{nodeName}.ts", "{nodeName}.types.ts"],
    },
    _pascal_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.json" },
        { name: "{FolderName}.ts" },
        { name: "{FolderName}.test.ts" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.utils.ts" },
        { name: "{FolderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
    },
    clients_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}Client", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    fragments_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    functions_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    utils_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
  },
  structure: {
    children: [
      { name: "eslint.config.js" },
      { name: "host.json" },
      { name: "jest.config.js" },
      { name: "package.json" },
      { name: "prettier.config.js" },
      {
        children: [
          { name: "clients", ruleId: "clients_folder" },
          { name: "fragments", ruleId: "fragments_folder" },
          { name: "functions", ruleId: "functions_folder" },
          { name: "utils", ruleId: "utils_folder" },
        ],
        enforceExistence: "functions",
        name: "src",
      },
      { name: "tsconfig.json" },
      { name: "webpack.config.ts" },
    ],
    enforceExistence: [
      "eslint.config.js",
      "host.json",
      "jest.config.js",
      "package.json",
      "prettier.config.js",
      "src",
      "tsconfig.json",
      "webpack.config.ts",
    ],
  },
});

export function createAzureFuncIndependentModules(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/*/index.ts",
        pattern: [["src/*/index.ts", "!src/functions/index.ts"]],
      },
      {
        allowImportsFrom: ["{element}", "{dirname}/*.types.ts"],
        name: "src/*/*/**/index.ts",
        pattern: "src/*/*/**/index.ts",
      },

      // <============================ CLIENTS ============================> //
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.types.ts",
        pattern: "src/clients/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.ts",
        pattern: "src/clients/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.test.ts",
        pattern: "src/clients/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.test.ts",
        pattern: "src/clients/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.ts",
        pattern: "src/clients/*/**/*.ts",
      },

      // <=========================== FRAGMENTS ===========================> //
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.types.ts",
        pattern: "src/fragments/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.utils.ts",
        pattern: "src/fragments/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.utils.test.ts",
        pattern: "src/fragments/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.test.ts",
        pattern: "src/fragments/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.ts",
        pattern: "src/fragments/*/**/*.ts",
      },

      // <=========================== FUNCTIONS ===========================> //
      {
        allowImportsFrom: [],
        name: "src/functions/index.ts",
        pattern: "src/functions/index.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/functions/*/**/*.types.ts",
        pattern: "src/functions/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/functions/*/**/*.utils.ts",
        pattern: "src/functions/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/functions/*/**/*.utils.test.ts",
        pattern: "src/functions/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/functions/*/**/*.test.ts",
        pattern: "src/functions/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "src/fragments/index.ts",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/functions/*/**/*.ts",
        pattern: "src/functions/*/**/*.ts",
      },

      // <============================= UTILS =============================> //
      {
        allowImportsFrom: ["src/utils/index.ts", "{typesFileAccessPaths}"],
        name: "src/utils/*/**/*.types.ts",
        pattern: "src/utils/*/**/*.types.ts",
      },
      {
        allowImportsFrom: ["src/utils/index.ts", "{utilsFileAccessPaths}"],
        name: "src/utils/*/**/*.utils.ts",
        pattern: "src/utils/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: ["src/utils/index.ts", "{utilsFileAccessPaths}"],
        name: "src/utils/*/**/*.utils.test.ts",
        pattern: "src/utils/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.test.ts",
        pattern: "src/utils/*/**/*.test.ts",
      },
      {
        allowImportsFrom: ["src/utils/index.ts", "{elementFileAccessPaths}"],
        name: "src/utils/*/**/*.ts",
        pattern: "src/utils/*/**/*.ts",
      },
    ],
    packageRoot: location,
    pathAliases: location
      ? {
          baseUrl: location,
          paths: paths || {},
        }
      : undefined,
    reusableImportPatterns: {
      element: [
        "{dirname}/*.ts",
        "!{dirname}/*.test.ts",
        "!{dirname}/*.types.ts",
        "!{dirname}/*.utils.ts",
        "!{dirname}/*.utils.test.ts",
      ],
      elementFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      elementTestFileAccessPaths: [
        "./package.json",
        "{element}",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      typesFileAccessPaths: ["./package.json", "{dirname}/*/index.ts"],
      utilsFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*/index.ts",
      ],
      utilsTestFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export const AZURE_FUNC_FILE_COMPOSITION = createFileComposition({
  filesRules: [
    // <============================= CLIENTS =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/clients/*/*.types.ts",
      rootSelectorsLimits: [{ limit: { min: 2 }, selector: "type" }],
      rules: [
        {
          format: ["{PascalCase}Request", "{PascalCase}Response"],
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        [
          "src/clients/*/*.ts",
          "!src/clients/*/index.ts",
          "!src/clients/*/*.test.ts",
          "!src/clients/*/*.utils.ts",
        ],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "class" }],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================ FUNCTIONS ===========================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/functions/*/index.ts",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "handler",
          scope: "fileRoot",
          selector: "function",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: ["src/functions/*/*.types.ts", "src/fragments/*/*.types.ts"],
      rootSelectorsLimits: [{ limit: { min: 2 }, selector: "type" }],
      rules: [
        {
          format: ["Input", "Output"],
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        [
          "src/functions/*/*.ts",
          "!src/functions/*/index.ts",
          "!src/functions/*/*.test.ts",
          "!src/functions/*/*.utils.ts",
        ],
        [
          "src/fragments/*/*.ts",
          "!src/fragments/*/index.ts",
          "!src/fragments/*/*.test.ts",
          "!src/fragments/*/*.utils.ts",
        ],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================= GENERAL =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/*/**/*.utils.ts",
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{camelCase}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{camelCase}", "{SNAKE_CASE}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{fileName}", "{FILE_NAME}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
  ],
  projectRoot: process.cwd(),
});

export const LIB_FOLDER_STRUCTURE = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{folderName}.json" },
        { name: "{folderName}.ts" },
        { name: "{folderName}.test.ts" },
        { name: "{folderName}.types.ts" },
        { name: "{folderName}.utils.ts" },
        { name: "{folderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{nodeName}.ts", "{nodeName}.types.ts"],
    },
    _pascal_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.json" },
        { name: "{FolderName}.ts" },
        { name: "{FolderName}.test.ts" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.utils.ts" },
        { name: "{FolderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
    },
    binaries_folder: {
      children: [
        { name: "{camelCase}.ts" },
        { name: "{camelCase}.test.ts" },
        {
          children: [
            { name: "index.ts" },
            { name: "{camelCase}", ruleId: "_camel_case_folder" },
            { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
          ],
          enforceExistence: "index.ts",
          name: "utils",
        },
      ],
    },
    classes_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    component_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.hooks.ts" },
        { name: "{FolderName}.hooks.test.ts" },
        { name: "{FolderName}.json" },
        { name: "{FolderName}.tsx" },
        { name: "{FolderName}.test.tsx" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.utils.ts" },
        { name: "{FolderName}.utils.test.ts" },
        { name: "{FolderName}(.module)?.(sass|css|scss)" },
        { name: "{PascalCase}", ruleId: "component_folder" },
      ],
      enforceExistence: [
        "index.ts",
        "{NodeName}.hooks.ts",
        "{NodeName}.tsx",
        "{NodeName}.types.ts",
      ],
    },
    components_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}", ruleId: "component_folder" },
      ],
      enforceExistence: "index.ts",
    },
    functions_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    modules_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    outputs_folder: {
      children: [
        { name: "{camelCase}.json" },
        { name: "{camelCase}.ts" },
        { name: "{PascalCase}.ts" },
        { name: "{PascalCase}.tsx" },
      ],
    },
    types_folder: {
      children: [{ name: "index.ts" }, { name: "{PascalCase}.types.ts" }],
      enforceExistence: "index.ts",
    },
  },
  structure: {
    children: [
      { name: "eslint.config.js" },
      { name: "jest.config.js" },
      { name: "package.json" },
      { name: "prettier.config.js" },
      {
        children: [
          { name: "index.ts" },
          { name: "index(.module)?.(sass|css|scss)" },
          { name: "binaries", ruleId: "binaries_folder" },
          { name: "classes", ruleId: "classes_folder" },
          { name: "components", ruleId: "components_folder" },
          { name: "functions", ruleId: "functions_folder" },
          { name: "modules", ruleId: "modules_folder" },
          { name: "outputs", ruleId: "outputs_folder" },
          { name: "types", ruleId: "types_folder" },
        ],
        enforceExistence: "index.ts",
        name: "src",
      },
      { name: "postcss.config.js" },
      { name: "tsconfig.json" },
      { name: "webpack.config.ts" },
    ],
    enforceExistence: [
      "eslint.config.js",
      "jest.config.js",
      "package.json",
      "postcss.config.js",
      "prettier.config.js",
      "src",
      "tsconfig.json",
      "webpack.config.ts",
    ],
  },
});

export function createLibIndependentModules(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      {
        allowImportsFrom: [
          "src/index?(.module).@(sass|css|scss)",
          "{noBinariesIndexPaths}",
        ],
        name: "src/index.ts",
        pattern: "src/index.ts",
      },

      // <============================ BINARIES ===========================> //
      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/binaries/utils/index.ts",
        pattern: "src/binaries/utils/index.ts",
      },
      {
        allowImportsFrom: ["{element}", "{dirname}/*.types.ts"],
        name: "src/*/*/**/index.ts",
        pattern: "src/binaries/utils/*/**/index.ts",
      },
      {
        allowImportsFrom: [
          "src/binaries/utils/index.ts",
          "{noBinariesIndexPaths}",
          "{typesFileAccessPaths}",
        ],
        name: "src/binaries/utils/*/**/*.types.ts",
        pattern: "src/binaries/utils/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "src/binaries/utils/index.ts",
          "{noBinariesIndexPaths}",
          "{utilsFileAccessPaths}",
        ],
        name: "src/binaries/utils/*/**/*.utils.ts",
        pattern: "src/binaries/utils/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "src/binaries/utils/index.ts",
          "{noBinariesIndexPaths}",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/binaries/utils/*/**/*.utils.test.ts",
        pattern: "src/binaries/utils/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "src/binaries/utils/index.ts",
          "{noBinariesIndexPaths}",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/binaries/utils/*/**/*.test.ts",
        pattern: "src/binaries/utils/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "src/binaries/utils/index.ts",
          "{noBinariesIndexPaths}",
          "{elementFileAccessPaths}",
        ],
        name: "src/binaries/utils/*/**/*.ts",
        pattern: "src/binaries/utils/*/**/*.ts",
      },

      // <============================= TYPES =============================> //
      {
        allowImportsFrom: ["{dirname}/*.types.ts"],
        name: "src/types/index.ts",
        pattern: "src/types/index.ts",
      },

      // <============================== REST =============================> //
      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/*/index.ts",
        pattern: "src/*/index.ts",
      },
      {
        allowImportsFrom: ["{element}", "{dirname}/*.types.ts"],
        name: "src/*/*/**/index.ts",
        pattern: "src/*/*/**/index.ts",
      },
      {
        allowImportsFrom: ["{noBinariesIndexPaths}", "{hooksFileAccessPaths}"],
        name: "src/*/*/**/*.hooks.ts",
        pattern: "src/*/*/**/*.hooks.ts",
      },
      {
        allowImportsFrom: [
          "{noBinariesIndexPaths}",
          "{hooksTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.hooks.test.ts",
        pattern: "src/*/*/**/*.hooks.test.ts",
      },
      {
        allowImportsFrom: ["{noBinariesIndexPaths}", "{typesFileAccessPaths}"],
        name: "src/*/*/**/*.types.ts",
        pattern: "src/*/*/**/*.types.ts",
      },
      {
        allowImportsFrom: ["{noBinariesIndexPaths}", "{utilsFileAccessPaths}"],
        name: "src/*/*/**/*.utils.ts",
        pattern: "src/*/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "{noBinariesIndexPaths}",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.utils.test.ts",
        pattern: "src/*/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "{noBinariesIndexPaths}",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.test.ts",
        pattern: ["src/*/*/**/*.test.ts", "src/*/*/**/*.test.tsx"],
      },
      {
        allowImportsFrom: [
          "{noBinariesIndexPaths}",
          "{elementFileAccessPaths}",
        ],
        name: "src/*/*/**/*.ts",
        pattern: ["src/*/*/**/*.ts", "src/*/*/**/*.tsx"],
      },
    ],
    packageRoot: location,
    pathAliases: location
      ? {
          baseUrl: location,
          paths: paths || {},
        }
      : undefined,
    reusableImportPatterns: {
      element: [
        "{dirname}/*.ts?(x)",
        "!{dirname}/*.hooks.ts",
        "!{dirname}/*.hooks.test.ts",
        "!{dirname}/*.test.ts?(x)",
        "!{dirname}/*.types.ts",
        "!{dirname}/*.utils.ts",
        "!{dirname}/*.utils.test.ts",
      ],
      elementFileAccessPaths: [
        "./package.json",
        "{dirname}/*.hooks.ts",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*?(.module).@(sass|css|scss)",
        "{dirname}/*/index.ts",
      ],
      elementTestFileAccessPaths: [
        "./package.json",
        "{element}",
        "{dirname}/*.hooks.ts",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      hooksFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      hooksTestFileAccessPaths: [
        "./package.json",
        "{dirname}/*.hooks.ts",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      noBinariesIndexPaths: [
        "src/classes/index.ts",
        "src/components/index.ts",
        "src/functions/index.ts",
        "src/modules/index.ts",
        "src/outputs/index.ts",
        "src/types/index.ts",
      ],
      typesFileAccessPaths: ["{dirname}/*/index.ts"],
      utilsFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*/index.ts",
      ],
      utilsTestFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export const LIB_FILE_COMPOSITION = createFileComposition({
  filesRules: [
    // <============================ BINARIES =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [["src/binaries/*.ts", "!src/binaries/*.test.ts"]],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================ CLASSES ==============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        [
          "src/classes/*/*.ts",
          "!src/classes/*/index.ts",
          "!src/classes/*/*.test.ts",
          "!src/classes/*/*.types.ts",
          "!src/classes/*/*.utils.ts",
        ],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "class" }],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================ COMPONENTS ===========================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/components/*/**/*.hooks.ts",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          filenamePartsToRemove: ".hooks",
          format: "use{FileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/components/*/**/*.types.ts",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "type" }],
      rules: [
        {
          filenamePartsToRemove: ".types",
          format: "{FileName}Props",
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        ["src/components/*/**/*.tsx", "!src/components/*/**/*.test.tsx"],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "function",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: { limitTo: "dynamic", type: "variableExpression" },
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <=========================== FUNCTIONS =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [
        [
          "src/functions/*/*.ts",
          "!src/functions/*/index.ts",
          "!src/functions/*/*.test.ts",
          "!src/functions/*/*.types.ts",
          "!src/functions/*/*.utils.ts",
        ],
      ],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },

    // <============================= GENERAL =============================> //
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/*/**/*.utils.ts",
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{camelCase}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{camelCase}", "{SNAKE_CASE}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{fileName}", "{FILE_NAME}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
  ],
  projectRoot: process.cwd(),
});

export const NODE_FOLDER_STRUCTURE = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{folderName}.json" },
        { name: "{folderName}.ts" },
        { name: "{folderName}.test.ts" },
        { name: "{folderName}.types.ts" },
        { name: "{folderName}.utils.ts" },
        { name: "{folderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{nodeName}.ts", "{nodeName}.types.ts"],
    },
    _pascal_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.json" },
        { name: "{FolderName}.ts" },
        { name: "{FolderName}.test.ts" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.utils.ts" },
        { name: "{FolderName}.utils.test.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
    },
    modules_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
  },
  structure: {
    children: [
      { name: "eslint.config.js" },
      { name: "jest.config.js" },
      { name: "package.json" },
      { name: "prettier.config.js" },
      {
        children: [
          { name: "index.ts" },
          { name: "{camelCase}", ruleId: "modules_folder" },
        ],
        enforceExistence: "index.ts",
        name: "src",
      },
      { name: "tsconfig.json" },
      { name: "webpack.config.ts" },
    ],
    enforceExistence: [
      "eslint.config.js",
      "jest.config.js",
      "package.json",
      "prettier.config.js",
      "src",
      "tsconfig.json",
      "webpack.config.ts",
    ],
  },
});

export function createNodeIndependentModules(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/index.ts",
        pattern: "src/index.ts",
      },
      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/*/index.ts",
        pattern: "src/*/index.ts",
      },
      {
        allowImportsFrom: ["{element}", "{dirname}/*.types.ts"],
        name: "src/*/*/**/index.ts",
        pattern: "src/*/*/**/index.ts",
      },
      {
        allowImportsFrom: ["src/*/index.ts", "{typesFileAccessPaths}"],
        name: "src/*/*/**/*.types.ts",
        pattern: "src/*/*/**/*.types.ts",
      },
      {
        allowImportsFrom: ["src/*/index.ts", "{utilsFileAccessPaths}"],
        name: "src/*/*/**/*.utils.ts",
        pattern: "src/*/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: ["src/*/index.ts", "{utilsTestFileAccessPaths}"],
        name: "src/*/*/**/*.utils.test.ts",
        pattern: "src/*/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: ["src/*/index.ts", "{elementTestFileAccessPaths}"],
        name: "src/*/*/**/*.test.ts",
        pattern: "src/*/*/**/*.test.ts",
      },
      {
        allowImportsFrom: ["src/*/index.ts", "{elementFileAccessPaths}"],
        name: "src/*/*/**/*.ts",
        pattern: "src/*/*/**/*.ts",
      },
    ],
    packageRoot: location,
    pathAliases: location
      ? {
          baseUrl: location,
          paths: paths || {},
        }
      : undefined,
    reusableImportPatterns: {
      element: [
        "{dirname}/*.ts",
        "!{dirname}/*.test.ts",
        "!{dirname}/*.types.ts",
        "!{dirname}/*.utils.ts",
        "!{dirname}/*.utils.test.ts",
      ],
      elementFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      elementTestFileAccessPaths: [
        "./package.json",
        "{element}",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
      typesFileAccessPaths: ["./package.json", "{dirname}/*/index.ts"],
      utilsFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*/index.ts",
      ],
      utilsTestFileAccessPaths: [
        "./package.json",
        "{dirname}/*.json",
        "{dirname}/*.types.ts",
        "{dirname}/*.utils.ts",
        "{dirname}/*/index.ts",
      ],
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export const NODE_FILE_COMPOSITION = createFileComposition({
  filesRules: [
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/index.ts",
      rules: [...PRIVATE_FILE_ROOTS_COMPOSITION],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        {
          format: "{PascalCase}",
          scope: "fileRoot",
          selector: "type",
        },
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: "src/*/*/**/*.utils.ts",
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{camelCase}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{camelCase}", "{SNAKE_CASE}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
    {
      allowOnlySpecifiedSelectors: {
        fileExport: true,
        fileRoot: true,
        nestedSelectors: true,
      },
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [
        {
          limit: { min: 1 },
          selector: ["class", "function", "variable", "variableExpression"],
        },
      ],
      rules: [
        {
          format: "{FileName}",
          scope: "fileExport",
          selector: "class",
        },
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        {
          format: ["{fileName}", "{FILE_NAME}"],
          scope: "fileExport",
          selector: ["variable", "variableExpression"],
        },
        ...PRIVATE_FILE_ROOTS_COMPOSITION,
      ],
    },
  ],
  projectRoot: process.cwd(),
});
