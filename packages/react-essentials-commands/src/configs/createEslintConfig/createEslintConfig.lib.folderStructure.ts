import { createFolderStructure } from "eslint-plugin-project-structure";
import process from "process";

const LIB_FOLDER_STRUCTURE = createFolderStructure({
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
        { name: "{FolderName}.hooks.ts" },
        { name: "{FolderName}.tsx?" },
        { name: "{FolderName}.types.ts" },
        { name: "{FolderName}.*.tsx?" },
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
      ],
      enforceExistence: ["index.ts", "{NodeName}.ts", "{NodeName}.types.ts"],
    },
  },
  structure: {
    children: [
      { name: "_bin" },
      { name: "_out" },
      { name: "eslint.config.js" },
      { name: "jest.config.js" },
      { name: "package.json" },
      { name: "prettier.config.js" },
      {
        children: [
          { name: "*.*" },
          { name: "{camelCase}", ruleId: "_camel_case_folder" },
          { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
        ],
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

export default LIB_FOLDER_STRUCTURE;
