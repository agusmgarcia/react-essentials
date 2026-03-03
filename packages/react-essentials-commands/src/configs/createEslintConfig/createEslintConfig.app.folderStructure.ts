// eslint-disable-next-line project-structure/folder-structure
import { createFolderStructure } from "eslint-plugin-project-structure";
import process from "process";

const APP_FOLDER_STRUCTURE = createFolderStructure({
  projectRoot: process.cwd(),
  rules: {
    _camel_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{folderName}.ts" },
        { name: "{folderName}.types.ts" },
        { name: "{folderName}.*.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{nodeName}.ts", "{nodeName}.types.ts"],
    },
    _pascal_case_folder: {
      children: [
        { name: "index.ts" },
        { name: "{FolderName}.ts" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.*.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
    },
    apis_folder: {
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
        { name: "{FolderName}.tsx" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.*.tsx?" },
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
        { name: "[^_]*.tsx" },
        { name: "[^_]*", ruleId: "page_folder" },
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
          { name: "[^_]*.tsx" },
          { name: "[^_]*", ruleId: "page_folder" },
        ],
        name: "pages",
      },
      { name: "postcss.config.js" },
      { name: "prettier.config.js" },
      { name: "public" },
      {
        children: [
          { name: "apis", ruleId: "apis_folder" },
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

export default APP_FOLDER_STRUCTURE;
