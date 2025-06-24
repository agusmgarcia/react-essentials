import { EOL } from "os";
import {
  format as formatPrettier,
  resolveConfig as resolveConfigPrettier,
} from "prettier";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

import {
  args,
  type AsyncFunc,
  files,
  folders,
  type Func,
  type getPackageJSON,
} from "#src/utils";

export type Context = {
  command:
    | "build"
    | "check"
    | "deploy"
    | "format"
    | "postpack"
    | "prepack"
    | "regenerate"
    | "start"
    | "test";
  core: NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>;
  defer: Func<void, [callback: Func | AsyncFunc]>;
  essentialsCommands: boolean;
  essentialsCommandsName: string;
  name: string;
  version: string;
};

type Options<TElement extends string | string[] | Record<string, any>> = {
  mapOutput?: Func<TElement, [input: TElement]>;
  path: string | Func<string, [context: Context]>;
  template:
    | Func<TElement, [context: Context]>
    | AsyncFunc<TElement, [context: Context]>;
  valid: Context["core"][];
};

export default function createMiddleware<
  TElement extends string | string[] | Record<string, any>,
>(options: Options<TElement>): AsyncFunc<void, [context: Context]> {
  return async (context) => {
    const path =
      typeof options.path === "string" ? options.path : options.path(context);

    const folderNames = path.split("/").slice(0, -1);

    for (let i = 0; i < folderNames.length; i++) {
      const folderPath = folderNames.slice(0, i + 1).join("/");
      await folders.upsertFolder(folderPath);
      context.defer(() => folders.removeFolderIfEmpty(folderPath));
    }

    if (!options.valid.includes(context.core)) {
      await files.removeFile(path);
      return;
    }

    const fileArgs = args.get("file");

    const output =
      context.command === "regenerate" &&
      (!fileArgs.length || fileArgs.includes(path))
        ? await options.template(context)
        : context.command === "format"
          ? await files
              .readFile(path)
              .then((file) => parse<TElement>(path, file))
          : undefined;

    if (typeof output === "undefined") return;

    await files.upsertFile(
      path,
      await format(
        path,
        stringify(
          path,
          !!options.mapOutput && typeof output !== "string"
            ? options.mapOutput(output)
            : output,
        ),
      ),
    );
  };
}

function parse<TElement extends string | string[] | Record<string, any>>(
  path: string,
  content: string | undefined,
): TElement | undefined {
  if (!content) return undefined;

  switch (path) {
    case "host.json":
    case "local.settings.json":
    case "package.json":
    case "tsconfig.json":
      return JSON.parse(content);

    case ".funcignore":
    case ".gitignore":
      return content.split(EOL) as TElement;

    case ".github/workflows/release.yml":
      return parseYaml(content);

    case ".env.local":
      return content.split(EOL).reduce(
        (result, line) => {
          const [key, value] = line.split("=", 2);
          if (!key) return result;

          result[key] = value || "";
          return result;
        },
        {} as Record<string, string>,
      ) as TElement;

    case ".eslintrc.js":
    case ".github/CHANGELOG.md":
    case ".github/README.md":
    case ".nvmrc":
    case "jest.config.js":
    case "next.config.js":
    case "pages/_app.tsx":
    case "pages/_app.css":
    case "postcss.config.js":
    case "prettier.config.js":
    case "src/functions/httpTrigger1.ts":
    case "src/index.css":
    case "src/index.ts":
    case "webpack.config.js":
    case "webpack.config.ts":
      return content as TElement;

    default:
      throw new Error(`File '${path}' not found`);
  }
}

function stringify<TElement extends string | string[] | Record<string, any>>(
  path: string,
  element: TElement,
): string {
  switch (path) {
    case "host.json":
    case "local.settings.json":
    case "package.json":
    case "tsconfig.json":
      return JSON.stringify(element, undefined, 2);

    case ".funcignore":
    case ".gitignore":
      return (element as string[]).join(EOL);

    case ".github/workflows/release.yml":
      return stringifyYaml(element, { lineWidth: 0, nullStr: "" })
        .split(EOL)
        .filter((item) => !!item)
        .map((item, index, array) => {
          if (!index) return item;
          const prevItem = array[index - 1];

          let match = item.match(/^(\s*)(.+?):$/);
          if (!!match) {
            const spaces = match[1];
            if (!spaces) return `${EOL}${item}`;

            const prevItemMatch = prevItem.match(/^(\s*).+?$/);
            if (!prevItemMatch) throw new Error("Unexpected scenario");

            const prevItemSpaces = prevItemMatch[1];
            if (spaces.length >= prevItemSpaces.length) return item;

            return `${EOL}${item}`;
          }

          match = item.match(/^(\s*-\s)name:\s.+?$/);
          if (!!match) {
            const spaces = match[1];
            if (!spaces) throw new Error("Unexpected scenario");

            const prevItemMatch = prevItem.match(/^(\s*).+?$/);
            if (!prevItemMatch) throw new Error("Unexpected scenario");

            const prevItemSpaces = prevItemMatch[1];
            if (spaces.length > prevItemSpaces.length) return item;

            return `${EOL}${item}`;
          }

          return item;
        })
        .join(EOL);

    case ".env.local":
      return Object.entries(element).reduce(
        (result, [key, value], index) =>
          `${result}${!!index ? EOL : ""}${key}=${value}`,
        "",
      );

    case ".eslintrc.js":
    case ".github/CHANGELOG.md":
    case ".github/README.md":
    case ".nvmrc":
    case "jest.config.js":
    case "next.config.js":
    case "pages/_app.tsx":
    case "pages/_app.css":
    case "postcss.config.js":
    case "prettier.config.js":
    case "src/functions/httpTrigger1.ts":
    case "src/index.css":
    case "src/index.ts":
    case "webpack.config.js":
    case "webpack.config.ts":
      return element as string;

    default:
      throw new Error(`File '${path}' not found`);
  }
}

async function format(path: string, output: string): Promise<string> {
  return await resolveConfigPrettier(path)
    .catch(() => null)
    .then((options) => formatPrettier(output, { ...options, filepath: path }))
    .catch(() => output);
}
