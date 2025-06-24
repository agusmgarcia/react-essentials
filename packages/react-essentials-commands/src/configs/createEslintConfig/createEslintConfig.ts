import { type Input, type Output } from "./createEslintConfig.types";

/**
 * Generates an ESLint configuration object tailored for React and TypeScript projects,
 * supporting Next.js, import sorting, and unused import detection.
 *
 * @param core - The core mode for the project, typically "app" or another string.
 *               Determines whether certain Next.js rules are enabled.
 * @returns An ESLint configuration object compatible with the flat config API.
 */
export default function createEslintConfig(...[core]: Input): Output {
  return {
    extends: [
      "plugin:sort/recommended",
      "next/core-web-vitals",
      "next/typescript",
    ],
    ignorePatterns: ["**/bin", "**/dist", "**/node_modules", "**/*.d.ts"],
    plugins: ["sort"],
    rules: {
      // @next
      "@next/next/no-html-link-for-pages": core === "app" ? "error" : "off",

      // @typescript-eslint
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

      // react
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-sort-props": ["error", { reservedFirst: true }],

      // sort
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
  };
}
