import path from "path";
import ts from "typescript";

import { files, filters, folders } from "#src/utils";

export const NODE_DEPENDENCIES = [
  "assert",
  "buffer",
  "child_process",
  "console",
  "constants",
  "crypto",
  "domain",
  "events",
  "fs",
  "http",
  "https",
  "os",
  "path",
  "process",
  "punycode",
  "querystring",
  "readline",
  "stream",
  "string_decoder",
  "sys",
  "timers",
  "tty",
  "url",
  "util",
  "vm",
  "zlib",
];

export async function getDependencies(
  folderPath: string,
  ...foldersExcluded: string[]
): Promise<string[]> {
  return await Promise.all(
    await getTypescriptFilePaths(folderPath, foldersExcluded).then(
      (filePaths) => filePaths.map(getDependenciesFromFile),
    ),
  )
    .then((dependencies) => dependencies.flatMap((dependency) => dependency))
    .then((dependencies) => dependencies.filter(filters.distinct));
}

async function getTypescriptFilePaths(
  folderPath: string,
  foldersExcluded: string[],
): Promise<string[]> {
  if (foldersExcluded.some((excluded) => folderPath.startsWith(excluded)))
    return [];

  return await Promise.all(
    await folders.readFolder(folderPath).then((fileNames) =>
      fileNames.map(async (fileName) => {
        const filePath = path.join(folderPath, fileName);

        if (await files.isDirectory(filePath))
          return await getTypescriptFilePaths(filePath, foldersExcluded);

        if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) return "";

        return filePath;
      }),
    ),
  )
    .then((filePaths) => filePaths.flatMap((filePath) => filePath))
    .then((filePaths) => filePaths.filter((filePath) => !!filePath));
}

async function getDependenciesFromFile(filePath: string): Promise<string[]> {
  const content = await files.readFile(filePath);
  const dependencies = new Array<string>();

  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  function visitor(node: ts.Node) {
    let moduleName = undefined;

    // --- ES Module Imports (import ... from 'module-name') ---
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      moduleName = node.moduleSpecifier.text;
    }

    // --- Dynamic Imports (import('module-name')) ---
    else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      moduleName = node.arguments[0].text;
    }

    // --- CommonJS/Require (const x = require('module-name')) ---
    else if (
      ts.isCallExpression(node) &&
      node.expression.getText(sourceFile) === "require" &&
      node.arguments.length > 0 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      moduleName = node.arguments[0].text;
    }

    if (
      !!moduleName &&
      !moduleName.startsWith(".") &&
      !moduleName.startsWith("#") &&
      !NODE_DEPENDENCIES.includes(moduleName)
    ) {
      dependencies.push(moduleName);
    }

    ts.forEachChild(node, visitor);
  }

  ts.forEachChild(sourceFile, visitor);

  return dependencies;
}
