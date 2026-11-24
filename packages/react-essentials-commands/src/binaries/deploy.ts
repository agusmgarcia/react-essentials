import path from "path";
import process from "process";

import { execute, getPackageJSON } from "#src/functions";
import { args, git, npm, question } from "#src/modules";
import { errors } from "#src/outputs/errors";
import { files } from "#src/outputs/files";

export default async function deploy(): Promise<void> {
  try {
    if (!(await git.isInsideRepository())) return;

    if (!(await git.isCurrentBranchSynced()))
      throw new Error("Your branch must be in synced with remote");

    const scope = await npm.getCurrentWorkspace().then((m) => m?.name);

    const lastTagMerged = await git
      .getTags({ merged: true, scope })
      .then((tags) => tags.at(-1));

    const typeOfNewVersion = await git
      .getCommits({
        initial: lastTagMerged,
        path: [
          process.cwd(),
          ...args.getStrings("path").map((p) => path.resolve(process.cwd(), p)),
        ],
      })
      .then((commits) => commits.reverse())
      .then(findTypeOfNewVersion);

    if (!typeOfNewVersion) return;

    const requiredVersion = args.getString("version");

    await validatePositionOfTheTag(
      scope,
      typeOfNewVersion,
      lastTagMerged,
      requiredVersion,
    );

    const newTag = await npm.getNewTag(requiredVersion || typeOfNewVersion);
    if (!newTag) return;

    await updateWorkspaceDependencies();

    await git.createCommit("chore: bump package version");
    await git.createTag(`${newTag}-temp`);
    await execute("npm run regenerate -- --file=.github/CHANGELOG.md", true);
    await git.deleteTag(`${newTag}-temp`);
    await git.createCommit("chore: bump package version", { amend: true });
    if (args.getBoolean("no-tag")) return;
    await git.createTag(newTag);
    await checkoutTagAndDeleteCurrentBranch(newTag);
    await createNextRelease(scope, typeOfNewVersion, newTag, lastTagMerged);
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

function findTypeOfNewVersion(
  commits: string[],
): "major" | "minor" | "patch" | undefined {
  if (!commits.length) return undefined;

  let bump: NonNullable<ReturnType<typeof findTypeOfNewVersion>> = "patch";

  for (let i = 0; i < commits.length; i++) {
    const commitInfo = git.getCommitInfo(commits[i]);
    if (commitInfo.isBreakingChange) {
      bump = "major";
      break;
    }

    if (commitInfo.type === "feat") {
      bump = "minor";
      continue;
    }
  }

  return bump;
}

async function updateWorkspaceDependencies(): Promise<void> {
  const packageJSON = await getPackageJSON();

  const workspaceNames = await npm
    .getWorkspaces()
    .then((ws) => ws.map((w) => w.name));

  if (!workspaceNames.length) return;

  const sections = [
    "dependencies",
    "peerDependencies",
    "devDependencies",
  ] as const;

  let changed = false;

  for (const section of sections) {
    const deps = packageJSON[section];
    if (!deps) continue;

    for (const depName of Object.keys(deps)) {
      if (!workspaceNames.includes(depName)) continue;

      const currentValue = deps[depName];
      if (currentValue === "*") continue;

      const lastMergedTag = await git
        .getTags({ merged: true, scope: depName })
        .then((tags) => tags.at(-1));

      if (!lastMergedTag) continue;

      const { major, minor, patch } = git.getTagInfo(lastMergedTag);
      const prefix = /^[^0-9]*/.exec(currentValue)?.[0] ?? "";
      const newValue = `${prefix}${major}.${minor}.${patch}`;

      if (newValue === currentValue) continue;

      deps[depName] = newValue;
      changed = true;
    }
  }

  if (!changed) return;

  await files.upsertFile(
    path.resolve(process.cwd(), "package.json"),
    JSON.stringify(packageJSON, null, 2) + "\n",
  );
}

async function validatePositionOfTheTag(
  scope: string | undefined,
  typeOfNewVersion: NonNullable<ReturnType<typeof findTypeOfNewVersion>>,
  lastTagMerged: string | undefined,
  requiredVersion: string | undefined,
): Promise<void> {
  const requiredVersionInfo = !!requiredVersion
    ? git.getTagInfo(requiredVersion)
    : undefined;

  if (!!requiredVersionInfo?.scope)
    throw new Error(
      `The required version ${requiredVersion} cannot contain scope`,
    );

  const allTags = await git
    .getTags({ scope })
    .then((tags) => tags.map(git.getTagInfo));

  if (!allTags.length) return;

  const lastTagMergedInfo = !!lastTagMerged
    ? git.getTagInfo(lastTagMerged)
    : { major: 0, minor: 0, patch: 0 };

  if (typeOfNewVersion === "major") {
    const lastTag = allTags.at(-1);

    if (!lastTag) throw new Error("Unreachable scenario");

    if (lastTagMergedInfo.major !== lastTag.major)
      throw new Error(
        `The major release needs to be created from v${lastTag.major}.x.x`,
      );

    if (!!requiredVersionInfo && requiredVersionInfo.major <= lastTag.major)
      throw new Error(
        `The major release needs to be greater or equal than v${lastTag.major + 1}.0.0`,
      );

    return;
  }

  if (typeOfNewVersion === "minor") {
    const lastTagOfMajor = allTags
      .filter((t) => t.major === lastTagMergedInfo.major)
      .at(-1);

    if (!lastTagOfMajor) throw new Error("Unreachable scenario");

    if (lastTagMergedInfo.minor !== lastTagOfMajor.minor)
      throw new Error(
        `The minor release needs to be created from v${lastTagOfMajor.major}.${lastTagOfMajor.minor}.x`,
      );

    if (
      !!requiredVersionInfo &&
      (requiredVersionInfo.major !== lastTagOfMajor.major ||
        requiredVersionInfo.minor <= lastTagOfMajor.minor)
    )
      throw new Error(
        `The minor release needs to be greater or equal than v${lastTagOfMajor.major}.${lastTagOfMajor.minor + 1}.0 and lower than v${lastTagOfMajor.major + 1}.0.0`,
      );

    return;
  }

  const lastTagOfMinor = allTags
    .filter(
      (t) =>
        t.major === lastTagMergedInfo.major &&
        t.minor === lastTagMergedInfo.minor,
    )
    .at(-1);

  if (!lastTagOfMinor) throw new Error("Unreachable scenario");

  if (lastTagMergedInfo.patch !== lastTagOfMinor.patch)
    throw new Error(
      `The patch release needs to be created from v${lastTagOfMinor.major}.${lastTagOfMinor.minor}.${lastTagOfMinor.patch}`,
    );

  if (
    !!requiredVersionInfo &&
    (requiredVersionInfo.major !== lastTagOfMinor.major ||
      requiredVersionInfo.minor !== lastTagOfMinor.minor ||
      requiredVersionInfo.patch <= lastTagOfMinor.patch)
  )
    throw new Error(
      `The patch release needs to be greater or equal than v${lastTagOfMinor.major}.${lastTagOfMinor.minor}.${lastTagOfMinor.patch + 1} and lower than v${lastTagOfMinor.major}.${lastTagOfMinor.minor + 1}.0`,
    );
}

async function checkoutTagAndDeleteCurrentBranch(
  newTag: string,
): Promise<void> {
  const defaultBranch = await git.getDefaultBranch();
  const currentBranch = await git.getCurrentBranch();

  if (!!defaultBranch && currentBranch === defaultBranch) return;

  await git.checkout(newTag);
  if (!!currentBranch) await git.deleteBranch(currentBranch);
}

async function createNextRelease(
  scope: string | undefined,
  typeOfNewVersion: NonNullable<ReturnType<typeof findTypeOfNewVersion>>,
  newTag: string,
  lastTagMerged: string | undefined,
): Promise<void> {
  if (!lastTagMerged) return;
  if (typeOfNewVersion === "major") return;

  const newTagInfo = git.getTagInfo(newTag);
  const allTags = await git
    .getTags({ scope })
    .then((tags) => tags.map(git.getTagInfo));

  let nextTagInfo: ReturnType<typeof git.getTagInfo> | undefined;

  if (typeOfNewVersion === "minor") {
    const tagsGroupedByMajor = allTags.reduce<
      Record<number, ReturnType<typeof git.getTagInfo>[]>
    >((result, tag) => {
      result[tag.major] ||= [];
      result[tag.major].push(tag);
      return result;
    }, {});

    nextTagInfo = tagsGroupedByMajor[newTagInfo.major + 1]?.at(-1);
  } else {
    const tagsGroupedByMajorAndMinor = allTags.reduce<
      Record<number, Record<number, ReturnType<typeof git.getTagInfo>[]>>
    >((result, tag) => {
      result[tag.major] ||= {};
      result[tag.major][tag.minor] ||= [];
      result[tag.major][tag.minor].push(tag);
      return result;
    }, {});

    nextTagInfo =
      tagsGroupedByMajorAndMinor[newTagInfo.major][newTagInfo.minor + 1]?.at(
        -1,
      ) || tagsGroupedByMajorAndMinor[newTagInfo.major + 1]?.[0]?.at(-1);
  }

  if (!nextTagInfo) return;
  const nextTag = `v${nextTagInfo.major}.${nextTagInfo.minor}.${nextTagInfo.patch}`;

  if (args.getBoolean("interactive")) {
    const response = await question(`Merge changes into ${nextTag}? (Y/n)`);
    if (response === "n") {
      console.log("Deploy finished!");
      return;
    }
  }

  await git.checkout(nextTag);
  await git.cherryPick(lastTagMerged, `${newTag}~1`);

  if (args.getBoolean("interactive")) {
    const response = await question(`Deploy changes into ${nextTag}? (Y/n)`);
    if (response === "n") {
      console.log(
        "Deploy stopped! You can add more commits to the current branch and then run npm run deploy again",
      );
      return;
    }
  }

  await deploy();
}

deploy();
