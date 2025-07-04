import process from "process";

import { args, errors, execute, git, npm, question } from "#src/utils";

export default async function deploy(): Promise<void> {
  try {
    if (!(await git.isInsideRepository())) return;

    if (!(await git.isCurrentBranchSynced()))
      throw new Error("Your branch must be in synced with remote");

    const scope = await npm.getMonorepoDetails().then((m) => m?.name);

    const lastTagMerged = await git
      .getTags({ merged: true, scope })
      .then((tags) => tags.at(-1));

    const typeOfNewVersion = await git
      .getCommits({ initial: lastTagMerged, path: process.cwd() })
      .then((commits) => commits.reverse())
      .then(findTypeOfNewVersion);

    if (!typeOfNewVersion) return;

    await validatePositionOfTheTag(scope, typeOfNewVersion, lastTagMerged);

    const newTag = await npm.getNewTag(typeOfNewVersion);
    if (!newTag) return;

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

async function validatePositionOfTheTag(
  scope: string | undefined,
  typeOfNewVersion: NonNullable<ReturnType<typeof findTypeOfNewVersion>>,
  lastTagMerged: string | undefined,
): Promise<void> {
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
