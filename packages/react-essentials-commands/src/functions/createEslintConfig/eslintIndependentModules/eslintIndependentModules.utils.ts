import { createIndependentModules } from "eslint-plugin-project-structure";

const ELEMENT = [
  [
    "{dirname}/*.ts?(x)",
    "!{dirname}/*.actions.ts",
    "!{dirname}/*.actions.test.ts",
    "!{dirname}/*.epics.ts",
    "!{dirname}/*.epics.test.ts",
    "!{dirname}/*.hooks.ts",
    "!{dirname}/*.hooks.test.ts",
    "!{dirname}/*.selectors.ts",
    "!{dirname}/*.selectors.test.ts",
    "!{dirname}/*.test.ts?(x)",
    "!{dirname}/*.types.ts",
    "!{dirname}/*.utils.ts",
    "!{dirname}/*.utils.test.ts",
  ],
];

const ALL_FAMILY_SIBLINGS = [
  ["{family_2}/*/index.ts", "!{family_2}/index.ts", "!{family_3}/*/index.ts"],
];

const OTHER_ROOT_SIBLINGS = [["src/*/index.ts", "!{family_2}/index.ts"]];

const ELEMENT_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.actions.ts",
  "{dirname}/*.hooks.ts",
  "{dirname}/*.json",
  "{dirname}/*.selectors.ts",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*?(.module).@(sass|css|scss)",
  "{dirname}/*/index.ts",
];

const ELEMENT_TEST_FILE_ACCESS_PATH = [
  "./package.json",
  [
    "{dirname}/*.ts?(x)",
    "!{dirname}/*.actions.ts",
    "!{dirname}/*.actions.test.ts",
    "!{dirname}/*.epics.ts",
    "!{dirname}/*.epics.test.ts",
    "!{dirname}/*.hooks.ts",
    "!{dirname}/*.hooks.test.ts",
    "!{dirname}/*.selectors.ts",
    "!{dirname}/*.selectors.test.ts",
    "!{dirname}/*.test.ts?(x)",
    "!{dirname}/*.types.ts",
    "!{dirname}/*.utils.ts",
    "!{dirname}/*.utils.test.ts",
  ],
  "{dirname}/*.actions.ts",
  "{dirname}/*.hooks.ts",
  "{dirname}/*.json",
  "{dirname}/*.selectors.ts",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const ACTIONS_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const ACTIONS_TEST_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.actions.ts",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const EPICS_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.actions.ts",
  "{dirname}/*.json",
  "{dirname}/*.selectors.ts",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const EPICS_TEST_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.actions.ts",
  "{dirname}/*.epics.ts",
  "{dirname}/*.json",
  "{dirname}/*.selectors.ts",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const SELECTORS_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const SELECTORS_TEST_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.json",
  "{dirname}/*.selectors.ts",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const HOOKS_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const HOOKS_TEST_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.hooks.ts",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

const TYPES_FILE_ACCESS_PATH = ["./package.json", "{dirname}/*/index.ts"];

const UTILS_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*/index.ts",
];

const UTILS_TEST_FILE_ACCESS_PATH = [
  "./package.json",
  "{dirname}/*.json",
  "{dirname}/*.types.ts",
  "{dirname}/*.utils.ts",
  "{dirname}/*/index.ts",
];

export function createApp(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      // <============================ INDICES ============================> //
      {
        allowImportsFrom: ["{dirname}/*/index.ts", "src/utils/index.ts"],
        name: "src/store/index.ts",
        pattern: "src/store/index.ts",
      },
      {
        allowImportsFrom: ["{dirname}/*/index.ts"],
        name: "src/*/index.ts",
        pattern: "src/*/index.ts",
      },
      {
        allowImportsFrom: [
          "{element}",
          "{dirname}/*.types.ts",
          "{dirname}/*actions.ts",
          "{dirname}/*epics.ts",
          "{dirname}/*selectors.ts",
        ],
        name: "src/*/*/**/index.ts",
        pattern: "src/*/*/**/index.ts",
      },

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

      // <============================ CLIENTS ============================> //
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.types.ts",
        pattern: "src/clients/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.ts",
        pattern: "src/clients/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.test.ts",
        pattern: "src/clients/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.test.ts",
        pattern: "src/clients/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{hooksFileAccessPaths}",
        ],
        name: "src/components/*/**/*.hooks.ts",
        pattern: "src/components/*/**/*.hooks.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{hooksTestFileAccessPaths}",
        ],
        name: "src/components/*/**/*.hooks.test.ts",
        pattern: "src/components/*/**/*.hooks.test.ts",
      },
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/components/*/**/*.types.ts",
        pattern: "src/components/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/components/*/**/*.utils.ts",
        pattern: "src/components/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/components/*/**/*.utils.test.ts",
        pattern: "src/components/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/components/*/**/*.test.tsx",
        pattern: "src/components/*/**/*.test.tsx",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/store/*/**/*.types.ts",
        pattern: "src/store/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{actionsTestFileAccessPaths}",
        ],
        name: "src/store/*/**/*.actions.test.ts",
        pattern: "src/store/*/**/*.actions.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{actionsFileAccessPaths}",
        ],
        name: "src/store/*/**/*.actions.ts",
        pattern: "src/store/*/**/*.actions.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{epicsTestFileAccessPaths}",
        ],
        name: "src/store/*/**/*.epics.test.ts",
        pattern: "src/store/*/**/*.epics.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{epicsFileAccessPaths}",
        ],
        name: "src/store/*/**/*.epics.ts",
        pattern: "src/store/*/**/*.epics.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{selectorsTestFileAccessPaths}",
        ],
        name: "src/store/*/**/*.selectors.test.ts",
        pattern: "src/store/*/**/*.selectors.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{selectorsFileAccessPaths}",
        ],
        name: "src/store/*/**/*.selectors.ts",
        pattern: "src/store/*/**/*.selectors.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "src/clients/index.ts",
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{elementFileAccessPaths}",
        ],
        name: "src/store/*/**/*.ts",
        pattern: "src/store/*/**/*.ts",
      },

      // <============================ UTILS ==============================> //
      {
        allowImportsFrom: ["{allFamilySiblings}", "{typesFileAccessPaths}"],
        name: "src/utils/*/**/*.types.ts",
        pattern: "src/utils/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "{utilsFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.utils.ts",
        pattern: "src/utils/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.utils.test.ts",
        pattern: "src/utils/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.test.ts",
        pattern: "src/utils/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "public/**/*",
          "{allFamilySiblings}",
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
      actionsFileAccessPaths: ACTIONS_FILE_ACCESS_PATH,
      actionsTestFileAccessPaths: ACTIONS_TEST_FILE_ACCESS_PATH,
      allFamilySiblings: ALL_FAMILY_SIBLINGS,
      element: ELEMENT,
      elementFileAccessPaths: ELEMENT_FILE_ACCESS_PATH,
      elementTestFileAccessPaths: ELEMENT_TEST_FILE_ACCESS_PATH,
      epicsFileAccessPaths: EPICS_FILE_ACCESS_PATH,
      epicsTestFileAccessPaths: EPICS_TEST_FILE_ACCESS_PATH,
      hooksFileAccessPaths: HOOKS_FILE_ACCESS_PATH,
      hooksTestFileAccessPaths: HOOKS_TEST_FILE_ACCESS_PATH,
      selectorsFileAccessPaths: SELECTORS_FILE_ACCESS_PATH,
      selectorsTestFileAccessPaths: SELECTORS_TEST_FILE_ACCESS_PATH,
      typesFileAccessPaths: TYPES_FILE_ACCESS_PATH,
      utilsFileAccessPaths: UTILS_FILE_ACCESS_PATH,
      utilsTestFileAccessPaths: UTILS_TEST_FILE_ACCESS_PATH,
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export function createAzureFunc(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      // <============================ INDICES ============================> //
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
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.types.ts",
        pattern: "src/clients/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.ts",
        pattern: "src/clients/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.utils.test.ts",
        pattern: "src/clients/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/clients/*/**/*.test.ts",
        pattern: "src/clients/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
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
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{typesFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.types.ts",
        pattern: "src/fragments/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.utils.ts",
        pattern: "src/fragments/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.utils.test.ts",
        pattern: "src/fragments/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "{allFamilySiblings}",
          "src/utils/index.ts",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/fragments/*/**/*.test.ts",
        pattern: "src/fragments/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "src/clients/index.ts",
          "{allFamilySiblings}",
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
        allowImportsFrom: ["{allFamilySiblings}", "{typesFileAccessPaths}"],
        name: "src/utils/*/**/*.types.ts",
        pattern: "src/utils/*/**/*.types.ts",
      },
      {
        allowImportsFrom: ["{allFamilySiblings}", "{utilsFileAccessPaths}"],
        name: "src/utils/*/**/*.utils.ts",
        pattern: "src/utils/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: ["{allFamilySiblings}", "{utilsFileAccessPaths}"],
        name: "src/utils/*/**/*.utils.test.ts",
        pattern: "src/utils/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "{allFamilySiblings}",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/utils/*/**/*.test.ts",
        pattern: "src/utils/*/**/*.test.ts",
      },
      {
        allowImportsFrom: ["{allFamilySiblings}", "{elementFileAccessPaths}"],
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
      allFamilySiblings: ALL_FAMILY_SIBLINGS,
      element: ELEMENT,
      elementFileAccessPaths: ELEMENT_FILE_ACCESS_PATH,
      elementTestFileAccessPaths: ELEMENT_TEST_FILE_ACCESS_PATH,
      typesFileAccessPaths: TYPES_FILE_ACCESS_PATH,
      utilsFileAccessPaths: UTILS_FILE_ACCESS_PATH,
      utilsTestFileAccessPaths: UTILS_TEST_FILE_ACCESS_PATH,
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export function createLib(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      // <============================ INDICES ============================> //
      {
        allowImportsFrom: [
          "src/index?(.module).@(sass|css|scss)",
          "src/*/index.ts",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
        ],
        name: "src/index.ts",
        pattern: "src/index.ts",
      },
      {
        allowImportsFrom: ["{dirname}/*.types.ts"],
        name: "src/types/index.ts",
        pattern: "src/types/index.ts",
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

      // <============================ BINARIES ===========================> //
      {
        allowImportsFrom: [
          "src/*/index.ts",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{dirname}/*/index.ts",
        ],
        name: "src/binaries/*.ts",
        pattern: "src/binaries/*.ts",
      },

      // <============================= TYPES =============================> //
      {
        allowImportsFrom: ["{dirname}/*.types.ts"],
        name: "src/types/*.types.ts",
        pattern: "src/types/*.types.ts",
      },

      // <============================== REST =============================> //
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
          "{hooksFileAccessPaths}",
        ],
        name: "src/*/*/**/*.hooks.ts",
        pattern: "src/*/*/**/*.hooks.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
          "{hooksTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.hooks.test.ts",
        pattern: "src/*/*/**/*.hooks.test.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
          "{typesFileAccessPaths}",
        ],
        name: "src/*/*/**/*.types.ts",
        pattern: "src/*/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
          "{utilsFileAccessPaths}",
        ],
        name: "src/*/*/**/*.utils.ts",
        pattern: "src/*/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.utils.test.ts",
        pattern: "src/*/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.test.ts",
        pattern: ["src/*/*/**/*.test.ts", "src/*/*/**/*.test.tsx"],
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "src/outputs/*/index.ts",
          "src/outputs/*.json",
          "{allFamilySiblings}",
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
      allFamilySiblings: ALL_FAMILY_SIBLINGS,
      element: ELEMENT,
      elementFileAccessPaths: ELEMENT_FILE_ACCESS_PATH,
      elementTestFileAccessPaths: ELEMENT_TEST_FILE_ACCESS_PATH,
      hooksFileAccessPaths: HOOKS_FILE_ACCESS_PATH,
      hooksTestFileAccessPaths: HOOKS_TEST_FILE_ACCESS_PATH,
      otherRootSiblings: OTHER_ROOT_SIBLINGS,
      typesFileAccessPaths: TYPES_FILE_ACCESS_PATH,
      utilsFileAccessPaths: UTILS_FILE_ACCESS_PATH,
      utilsTestFileAccessPaths: UTILS_TEST_FILE_ACCESS_PATH,
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}

export function createNode(
  location: string | undefined,
  paths: Record<string, string[]> | undefined,
) {
  return createIndependentModules({
    modules: [
      // <============================ INDICES ============================> //
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

      // <============================== REST =============================> //
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "{allFamilySiblings}",
          "{typesFileAccessPaths}",
        ],
        name: "src/*/*/**/*.types.ts",
        pattern: "src/*/*/**/*.types.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "{allFamilySiblings}",
          "{utilsFileAccessPaths}",
        ],
        name: "src/*/*/**/*.utils.ts",
        pattern: "src/*/*/**/*.utils.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "{allFamilySiblings}",
          "{utilsTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.utils.test.ts",
        pattern: "src/*/*/**/*.utils.test.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "{allFamilySiblings}",
          "{elementTestFileAccessPaths}",
        ],
        name: "src/*/*/**/*.test.ts",
        pattern: "src/*/*/**/*.test.ts",
      },
      {
        allowImportsFrom: [
          "{otherRootSiblings}",
          "{allFamilySiblings}",
          "{elementFileAccessPaths}",
        ],
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
      allFamilySiblings: ALL_FAMILY_SIBLINGS,
      element: ELEMENT,
      elementFileAccessPaths: ELEMENT_FILE_ACCESS_PATH,
      elementTestFileAccessPaths: ELEMENT_TEST_FILE_ACCESS_PATH,
      otherRootSiblings: OTHER_ROOT_SIBLINGS,
      typesFileAccessPaths: TYPES_FILE_ACCESS_PATH,
      utilsFileAccessPaths: UTILS_FILE_ACCESS_PATH,
      utilsTestFileAccessPaths: UTILS_TEST_FILE_ACCESS_PATH,
    },
    tsconfigPath: location ? `${location}/tsconfig.json` : undefined,
  });
}
