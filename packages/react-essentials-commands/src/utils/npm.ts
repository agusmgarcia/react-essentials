import { EOL } from "os";
import process from "process";

import execute from "./execute";
import * as git from "./git";

export async function getMonorepoDetails(): Promise<
  { name: string } | undefined
> {
  return await execute("npm query .workspace", false)
    .then((result) => result.replace(EOL, ""))
    .then(JSON.parse)
    .then((ws) => ws.find((w: any) => w.realpath === process.cwd()));
}

export async function getNewTag(
  typeOfNewVersion: "major" | "minor" | "patch",
): Promise<string | undefined> {
  let tag = await execute(
    `npm version --no-git-tag-version ${typeOfNewVersion}`,
    false,
  ).then((tag) => tag.replace(EOL, ""));

  const match = /(.*)v(\d+)\.(\d+)\.(\d+)/.exec(tag);
  if (!!match?.length)
    tag = `${!!match[1] ? `${match[1]}@` : ""}v${match[2]}.${match[3]}.${match[4]}`;

  try {
    git.getTagInfo(tag);
    return tag;
  } catch {
    console.error(`There was an error creating the tag ${tag}`);
    return undefined;
  }
}

export async function getVersion(
  dependency: string,
): Promise<string | undefined> {
  return await execute(`npm view ${dependency} version`, false)
    .then((result) => result.split(EOL))
    .then((result) => result.at(-2))
    .then((result) => result?.replace(/^.+?\s'(.+?)'$/, "$1"))
    .catch(() => undefined);
}

export async function isDependencyInstalled(
  dependency: string,
  options?: { peer?: true },
): Promise<boolean> {
  return await execute(
    `npm list -p${!!options?.peer ? " --omit=dev --omit=optional" : ""} ${dependency}`,
    false,
  )
    .then((result) => result.replace(EOL, ""))
    .then((result) => !!result);
}
