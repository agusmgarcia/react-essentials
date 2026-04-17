import { createFolderStructure } from "eslint-plugin-project-structure";
import process from "process";

const CAMEL_CASE_FOLDER = {
  children: [
    { name: "index.ts" },
    { name: "{folderName}.json" },
    { name: "{folderName}.ts" },
    { name: "{folderName}.test.ts" },
    { name: "{folderName}.types.ts" },
    { name: "{folderName}.utils.ts" },
    { name: "{folderName}.utils.test.ts" },
    { name: "{camelCase}", ruleId: "_camel_case_folder" as const },
    { name: "{PascalCase}", ruleId: "_pascal_case_folder" as const },
  ],
  enforceExistence: ["index.ts", "{nodeName}.ts", "{nodeName}.types.ts"],
};

const PASCAL_CASE_FOLDER = {
  children: [
    { name: "index.ts" },
    { name: "{FolderName}.json" },
    { name: "{FolderName}.ts" },
    { name: "{FolderName}.test.ts" },
    { name: "{FolderName}.types.ts" },
    { name: "{FolderName}.utils.ts" },
    { name: "{FolderName}.utils.test.ts" },
    { name: "{camelCase}", ruleId: "_camel_case_folder" as const },
    { name: "{PascalCase}", ruleId: "_pascal_case_folder" as const },
  ],
  enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
};

const COMPONENT_FOLDER = {
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
    { name: "{PascalCase}", ruleId: "component_folder" as const },
  ],
  enforceExistence: [
    "index.ts",
    "{NodeName}.hooks.ts",
    "{NodeName}.tsx",
    "{NodeName}.types.ts",
  ],
};

export const APP = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: CAMEL_CASE_FOLDER,
    _pascal_case_folder: PASCAL_CASE_FOLDER,
    clients_folder: {
      children: [
        { name: "index.ts" },
        { name: "{PascalCase}Client", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: "index.ts",
    },
    component_folder: COMPONENT_FOLDER,
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

export const AZURE_FUNC = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: CAMEL_CASE_FOLDER,
    _pascal_case_folder: PASCAL_CASE_FOLDER,
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

export const LIB = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: CAMEL_CASE_FOLDER,
    _pascal_case_folder: PASCAL_CASE_FOLDER,
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
    component_folder: COMPONENT_FOLDER,
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

export const NODE = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: CAMEL_CASE_FOLDER,
    _pascal_case_folder: PASCAL_CASE_FOLDER,
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
