import * as path from "path";
import process from "process";
import { rollup } from "rollup";
import dts from "rollup-plugin-dts";

import { runCommand } from "#src/binaries/utils";
import { execute, getPackageJSON } from "#src/functions";
import { files, folders } from "#src/modules";
import { errors } from "#src/outputs/errors";

export default async function build(): Promise<void> {
  try {
    const packageJSON = await getPackageJSON();
    const core = packageJSON.core;

    if (core === "app")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("next build --webpack", true),
      );

    if (core === "azure-func")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );

    if (core === "lib")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
        async () =>
          Promise.resolve([
            ...Object.keys(packageJSON.dependencies || {}),
            ...Object.keys(packageJSON.peerDependencies || {}),
          ]).then((externals) =>
            folders
              .readFolder(path.resolve("dist", "outputs"))
              .then((fs) => fs.filter((f) => !f.endsWith(".json")))
              .then((fs) => fs.map((f) => path.join("dist", "outputs", f)))
              .then((fs) => fs.map((f) => runDtsRollup(f, externals)))
              .then((fs) => fs.concat(runDtsRollup("dist", externals)))
              .then((fs) => Promise.all(fs))
              .then(() => {}),
          ),
        () => execute("del dist/**/*.d.ts", true),
        () => renameTypings(path.resolve("dist")),
      );

    if (core === "node")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

async function runDtsRollup(
  indexFilePath: string,
  external: string[],
): Promise<void> {
  const bundle = await rollup({
    external: (id) => external.some((e) => id === e || id.startsWith(e + "/")),
    input: path.join(indexFilePath, "index.d.ts"),
    plugins: [
      dts({
        respectExternal: true,
        tsconfig: path.resolve("tsconfig.json"),
      }),
    ],
  });

  await bundle.write({
    file: path.join(indexFilePath, "index.d.ts2"),
    format: "es",
  });

  await bundle.close();
}

async function renameTypings(dir: string): Promise<void> {
  await folders
    .readFolder(dir)
    .then((fs) =>
      fs.map(async (f) => {
        const fullPath = path.resolve(dir, f);

        const isFolder = await folders.isFolder(fullPath);
        if (isFolder) {
          await renameTypings(fullPath);
          return;
        }

        if (f === "index.d.ts2") {
          await files.renameFile(fullPath, path.join(dir, "index.d.ts"));
          return;
        }
      }),
    )
    .then((promises) => Promise.all(promises));
}

build();
