import {
  createFolderStructure,
  createIndependentModules,
} from "eslint-plugin-project-structure";

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

export const APP_INDEPENDENT_MODULES = createIndependentModules({
  modules: [
    {
      allowImportsFrom: [],
      name: "Pages_Document",
      pattern: "pages/_document.tsx",
    },
    {
      allowImportsFrom: [
        "pages/_app.css",
        "src/clients/index.ts",
        "src/pages/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
      ],
      name: "Pages_App",
      pattern: "pages/_app.tsx",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/pages/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
      ],
      name: "Page_Element",
      pattern: "pages/**/*.tsx",
    },
    {
      allowImportsFrom: ["{dirname}/*/index.ts"],
      name: "Module_Index",
      pattern: "src/*/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*.ts", "{dirname}/*.types.ts"],
      name: "Internal_Index",
      pattern: "src/*/*/**/index.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Client",
      pattern: "src/clients/*/**/*.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Client_Types",
      pattern: "src/clients/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Client_Utils",
      pattern: "src/clients/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Component",
      pattern: "src/components/*/**/*.tsx",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/utils/index.ts",
        "{hooksPattern}",
      ],
      name: "Component_Hooks",
      pattern: "src/components/*/**/*.hooks.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Component_Types",
      pattern: "src/components/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Component_Utils",
      pattern: "src/components/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Fragment",
      pattern: "src/fragments/*/**/*.tsx",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{hooksPattern}",
      ],
      name: "Fragment_Hooks",
      pattern: "src/fragments/*/**/*.hooks.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Fragment_Types",
      pattern: "src/fragments/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Fragment_Utils",
      pattern: "src/fragments/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/pages/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Page",
      pattern: "src/pages/*/**/*.tsx",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/pages/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{hooksPattern}",
      ],
      name: "Page_Hooks",
      pattern: "src/pages/*/**/*.hooks.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/pages/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Page_Types",
      pattern: "src/pages/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/components/index.ts",
        "src/fragments/index.ts",
        "src/pages/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Page_Utils",
      pattern: "src/pages/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Slice",
      pattern: "src/store/*/**/*.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Slice_Types",
      pattern: "src/store/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/store/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Slice_Utils",
      pattern: "src/store/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: ["src/utils/index.ts", "{elementPattern}"],
      name: "Util",
      pattern: "src/utils/*/**/*.ts",
    },
    {
      allowImportsFrom: ["src/utils/index.ts", "{typesPattern}"],
      name: "Util_Types",
      pattern: "src/utils/*/**/*.types.ts",
    },
    {
      allowImportsFrom: ["src/utils/index.ts", "{utilsPattern}"],
      name: "Util_Utils",
      pattern: "src/utils/*/**/*.utils.ts",
    },
  ],
  packageRoot: process.cwd(),
  reusableImportPatterns: {
    elementPattern: [
      "./package.json",
      "{dirname}/*.hooks.ts",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*.utils.ts",
      "{dirname}/*(.module)?.(sass|css|scss)",
      "{dirname}/*/index.ts",
    ],
    hooksPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*.utils.ts",
      "{dirname}/*/index.ts",
    ],
    typesPattern: ["./package.json", "{dirname}/*/index.ts"],
    utilsPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*/index.ts",
    ],
  },
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

export const AZURE_FUNC_INDEPENDENT_MODULES = createIndependentModules({
  modules: [
    {
      allowImportsFrom: [],
      name: "Function_Index",
      pattern: "src/functions/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*/index.ts"],
      name: "Module_Index",
      pattern: "src/*/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*.ts", "{dirname}/*.types.ts"],
      name: "Internal_Index",
      pattern: "src/*/*/**/index.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Client",
      pattern: "src/clients/*/**/*.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Client_Types",
      pattern: "src/clients/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Client_Utils",
      pattern: "src/clients/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/fragments/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Fragment",
      pattern: "src/fragments/*/**/*.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/fragments/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Fragment_Types",
      pattern: "src/fragments/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/fragments/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Fragment_Utils",
      pattern: "src/fragments/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/fragments/index.ts",
        "src/functions/index.ts",
        "src/utils/index.ts",
        "{elementPattern}",
      ],
      name: "Function",
      pattern: "src/functions/*/**/*.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/fragments/index.ts",
        "src/functions/index.ts",
        "src/utils/index.ts",
        "{typesPattern}",
      ],
      name: "Function_Types",
      pattern: "src/functions/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/clients/index.ts",
        "src/fragments/index.ts",
        "src/functions/index.ts",
        "src/utils/index.ts",
        "{utilsPattern}",
      ],
      name: "Function_Utils",
      pattern: "src/functions/*/**/*.utils.ts",
    },
    {
      allowImportsFrom: ["src/utils/index.ts", "{elementPattern}"],
      name: "Util",
      pattern: "src/utils/*/**/*.ts",
    },
    {
      allowImportsFrom: ["src/utils/index.ts", "{typesPattern}"],
      name: "Util_Types",
      pattern: "src/utils/*/**/*.types.ts",
    },
    {
      allowImportsFrom: ["src/utils/index.ts", "{utilsPattern}"],
      name: "Util_Utils",
      pattern: "src/utils/*/**/*.utils.ts",
    },
  ],
  packageRoot: process.cwd(),
  reusableImportPatterns: {
    elementPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*.utils.ts",
      "{dirname}/*/index.ts",
    ],
    typesPattern: ["./package.json", "{dirname}/*/index.ts"],
    utilsPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*/index.ts",
    ],
  },
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
        { name: "{camelCase}", ruleId: "_camel_case_folder" },
        { name: "{PascalCase}", ruleId: "_pascal_case_folder" },
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

export const LIB_INDEPENDENT_MODULES = createIndependentModules({
  modules: [
    {
      allowImportsFrom: [
        "{dirname}/index(.module)?.(sass|css|scss)",
        "{dirname}/(classes|components|functions|modules|outputs|types)/index.ts",
      ],
      name: "Main_Index",
      pattern: "src/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*/index.ts"],
      name: "Module_Index",
      pattern: "src/*/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*.ts", "{dirname}/*.types.ts"],
      name: "Internal_Index",
      pattern: "src/*/*/**/index.ts",
    },
    {
      allowImportsFrom: [
        "src/(classes|components|functions|modules|outputs|types)/index.ts",
        "{elementPattern}",
      ],
      name: "Element",
      pattern: "src/*/*/**/*.ts",
    },
    {
      allowImportsFrom: [
        "src/(classes|components|functions|modules|outputs|types)/index.ts",
        "{typesPattern}",
      ],
      name: "Element_Types",
      pattern: "src/*/*/**/*.types.ts",
    },
    {
      allowImportsFrom: [
        "src/(classes|components|functions|modules|outputs|types)/index.ts",
        "{utilsPattern}",
      ],
      name: "Element_Utils",
      pattern: "src/*/*/**/*.utils.ts",
    },
  ],
  packageRoot: process.cwd(),
  reusableImportPatterns: {
    elementPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*.utils.ts",
      "{dirname}/*(.module)?.(sass|css|scss)",
      "{dirname}/*/index.ts",
    ],
    typesPattern: ["./package.json", "{dirname}/*/index.ts"],
    utilsPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*/index.ts",
    ],
  },
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

export const NODE_INDEPENDENT_MODULES = createIndependentModules({
  modules: [
    {
      allowImportsFrom: ["{dirname}/*/index.ts"],
      name: "Main_Index",
      pattern: "src/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*/index.ts"],
      name: "Module_Index",
      pattern: "src/*/index.ts",
    },
    {
      allowImportsFrom: ["{dirname}/*.ts", "{dirname}/*.types.ts"],
      name: "Internal_Index",
      pattern: "src/*/*/**/index.ts",
    },
    {
      allowImportsFrom: ["src/*/index.ts", "{elementPattern}"],
      name: "Element",
      pattern: "src/*/*/**/*.ts",
    },
    {
      allowImportsFrom: ["src/*/index.ts", "{typesPattern}"],
      name: "Element_Types",
      pattern: "src/*/*/**/*.types.ts",
    },
    {
      allowImportsFrom: ["src/*/index.ts", "{utilsPattern}"],
      name: "Element_Utils",
      pattern: "src/*/*/**/*.utils.ts",
    },
  ],
  packageRoot: process.cwd(),
  reusableImportPatterns: {
    elementPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*.utils.ts",
      "{dirname}/*/index.ts",
    ],
    typesPattern: ["./package.json", "{dirname}/*/index.ts"],
    utilsPattern: [
      "./package.json",
      "{dirname}/*.json",
      "{dirname}/*.types.ts",
      "{dirname}/*/index.ts",
    ],
  },
});
