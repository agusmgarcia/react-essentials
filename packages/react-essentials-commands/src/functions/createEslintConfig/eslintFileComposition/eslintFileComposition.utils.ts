import { createFileComposition } from "eslint-plugin-project-structure";
import process from "process";

const ALLOW_ONLY_SPECIFIED_SELECTORS = {
  fileExport: true,
  fileRoot: true,
  nestedSelectors: true,
};

type FileRoot = NonNullable<
  Parameters<typeof createFileComposition>[0]["filesRules"][number]["rules"]
>[number];

const NESTED_SELECTORS: FileRoot[] = [
  {
    format: "{camelCase}",
    scope: "nestedSelectors",
    selector: ["function", "arrowFunction"],
  },
  {
    format: ["{camelCase}", "{SNAKE_CASE}"],
    scope: "nestedSelectors",
    selector: ["variable", "variableExpression"],
  },
  {
    format: "{PascalCase}",
    scope: "nestedSelectors",
    selector: ["type", "class"],
  },
];

const COMPONENT_FILE_ROOT: FileRoot[] = [
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
];

const FUNCTION_FILE_ROOT: FileRoot[] = [
  {
    format: "{camelCase}",
    scope: "fileRoot",
    selector: "function",
  },
];

const VARIABLE_FILE_ROOT: FileRoot[] = [
  {
    format: ["{camelCase}", "{SNAKE_CASE}"],
    scope: "fileRoot",
    selector: ["variable", "variableExpression"],
  },
];

const TYPE_FILE_ROOT: FileRoot[] = [
  {
    format: "{PascalCase}",
    scope: "fileRoot",
    selector: "type",
  },
];

const CLASS_FILE_ROOT: FileRoot[] = [
  {
    format: "{PascalCase}",
    scope: "fileRoot",
    selector: "class",
  },
  {
    format: ["{camelCase}", "_{camelCase}", "{SNAKE_CASE}"],
    scope: "nestedSelectors",
    selector: "propertyDefinition",
  },
];

export const APP = createFileComposition({
  filesRules: [
    // <============================== PAGES ==============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "pages/_app.tsx",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "App",
          scope: "fileExport",
          selector: "function",
        },
        ...NESTED_SELECTORS,
        ...COMPONENT_FILE_ROOT,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: [["pages/**/*.tsx", "!pages/_document.tsx"]],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "function",
        },
        ...NESTED_SELECTORS,
        ...COMPONENT_FILE_ROOT,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================= CLIENTS =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/clients/*/*.types.ts",
      rootSelectorsLimits: [{ limit: { min: 2 }, selector: "type" }],
      rules: [
        {
          format: ["{PascalCase}Request", "{PascalCase}Response"],
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <================== COMPONENTS / FRAGMENTS / PAGES =================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...COMPONENT_FILE_ROOT,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================== STORE ==============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================= GENERAL =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [],
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
  ],
  projectRoot: process.cwd(),
});

export const AZURE_FUNC = createFileComposition({
  filesRules: [
    // <============================= CLIENTS =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/clients/*/*.types.ts",
      rootSelectorsLimits: [{ limit: { min: 2 }, selector: "type" }],
      rules: [
        {
          format: ["{PascalCase}Request", "{PascalCase}Response"],
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <====================== FUNCTIONS / FRAGMENTS ======================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/functions/*/index.ts",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "handler",
          scope: "fileRoot",
          selector: "function",
        },
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: ["src/functions/*/*.types.ts", "src/fragments/*/*.types.ts"],
      rootSelectorsLimits: [{ limit: { min: 2 }, selector: "type" }],
      rules: [
        {
          format: ["Input", "Output"],
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================= GENERAL =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [],
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
  ],
  projectRoot: process.cwd(),
});

export const LIB = createFileComposition({
  filesRules: [
    // <============================ BINARIES =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: [["src/binaries/*.ts", "!src/binaries/*.test.ts"]],
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          format: "{fileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================ CLASSES ==============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================ COMPONENTS ===========================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/components/*/**/*.hooks.ts",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "function" }],
      rules: [
        {
          filenamePartsToRemove: ".hooks",
          format: "use{FileName}",
          scope: "fileExport",
          selector: "function",
        },
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/components/*/**/*.types.ts",
      rootSelectorsLimits: [{ limit: { min: 1 }, selector: "type" }],
      rules: [
        {
          filenamePartsToRemove: ".types",
          format: "{FileName}Props",
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...COMPONENT_FILE_ROOT,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <=========================== FUNCTIONS =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },

    // <============================= GENERAL =============================> //
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [],
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
  ],
  projectRoot: process.cwd(),
});

export const NODE = createFileComposition({
  filesRules: [
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/index.ts",
      rootSelectorsLimits: [],
      rules: [
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/**/index.ts",
      rootSelectorsLimits: [],
      rules: [],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: "src/*/**/*.types.ts",
      rootSelectorsLimits: [],
      rules: [
        {
          format: "{PascalCase}",
          scope: "fileExport",
          selector: "type",
        },
        ...TYPE_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
    {
      allowOnlySpecifiedSelectors: ALLOW_ONLY_SPECIFIED_SELECTORS,
      filePattern: [["src/*/*/**/*.ts", "!src/*/*/**/*.test.ts"]],
      rootSelectorsLimits: [],
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
        ...NESTED_SELECTORS,
        ...FUNCTION_FILE_ROOT,
        ...VARIABLE_FILE_ROOT,
        ...TYPE_FILE_ROOT,
        ...CLASS_FILE_ROOT,
      ],
    },
  ],
  projectRoot: process.cwd(),
});
