import { createFolderStructure } from "eslint-plugin-project-structure";
import process from "process";

const AZURE_FUNC_FOLDER_STRUCTURE = createFolderStructure({
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
    fragments_folder: {
      children: [
        { name: "index.ts" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
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
          { name: "index.ts" },
          { name: "apis", ruleId: "apis_folder" },
          { name: "fragments", ruleId: "fragments_folder" },
          { name: "functions", ruleId: "functions_folder" },
          { name: "utils", ruleId: "utils_folder" },
        ],
        enforceExistence: ["index.ts", "functions"],
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

export default AZURE_FUNC_FOLDER_STRUCTURE;
