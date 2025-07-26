import { EOL } from "os";

import execute from "./execute";
import type Func from "./Func.types";

// <=============================== BRANCHES ===============================> //

export async function deleteBranch(branch: string): Promise<void> {
  await execute(`git branch -D ${branch}`, true);

  const remote = await getRemoteName();
  if (!remote) return;

  await execute(`git push --delete ${remote} ${branch} --no-verify`, true);
}

export async function getCurrentBranch(): Promise<string | undefined> {
  return await execute("git branch --show-current", false).then((branch) =>
    branch?.replace(EOL, ""),
  );
}

export async function getDefaultBranch(): Promise<string | undefined> {
  return await getRemoteName().then((remote) =>
    !!remote
      ? execute(`git remote show ${remote}`, false).then((branch) =>
          branch
            .split(EOL)
            .find((line) => line.startsWith("  HEAD branch: "))
            ?.replace("  HEAD branch: ", ""),
        )
      : undefined,
  );
}

export async function isCurrentBranchSynced(): Promise<boolean> {
  return await execute("git fetch -p -P", true)
    .then(() => execute("git diff @{upstream}", false))
    .then((diffs) => !diffs)
    .catch(() => true);
}

// <=============================== COMMITS ===============================> //

export async function cherryPick(
  initialCommit: string,
  lastCommit: string,
): Promise<void> {
  await execute(`git cherry-pick ${initialCommit}..${lastCommit}`, true);
}

const COMMIT_REGEXP = /^(chore|feat|fix|refactor)(?:\((.*)\))?(!)?:\s(.*)$/;

export async function getCommits(
  options?: Partial<{
    initial: string;
    last: string;
    path: string;
  }>,
): Promise<string[]> {
  return await getDetailedCommits(options).then((commits) =>
    commits.map((c) => c.commit),
  );
}

export async function getDetailedCommits(
  options?: Partial<{
    initial: string;
    last: string;
    path: string;
  }>,
): Promise<{ commit: string; createdAt: Date; sha: string }[]> {
  return await execute("git fetch -p -P", true)
    .then(() =>
      execute(
        !!options?.initial
          ? `git log --pretty=format:"%H-----%ci-----%s" ${options.initial}...${options.last || "HEAD"}${!!options.path ? ` -- ${options.path}` : ""}`
          : `git log --pretty=format:"%H-----%ci-----%s" ${options?.last || "HEAD"}${!!options?.path ? ` -- ${options.path}` : ""}`,
        false,
      ),
    )
    .then((commits) => commits?.split(EOL) || [])
    .then((commits) => commits.map((c) => c.replaceAll('"', "").split("-----")))
    .then((commits) =>
      commits.map(([sha, createdAt, commit]) => ({
        commit,
        createdAt: new Date(createdAt),
        sha,
      })),
    )
    .then((commits) => commits.reverse());
}

export function getCommitInfo(commit: string): {
  isBreakingChange: boolean;
  message: string;
  scope: string | undefined;
  type: "chore" | "feat" | "fix" | "refactor";
} {
  const commitInfo = COMMIT_REGEXP.exec(commit);
  if (!commitInfo)
    return {
      isBreakingChange: false,
      message: commit,
      scope: undefined,
      type: "chore",
    };

  return {
    isBreakingChange: commitInfo[3] === "!",
    message: commitInfo[4],
    scope: commitInfo[2],
    type: commitInfo[1] as ReturnType<typeof getCommitInfo>["type"],
  };
}

export async function createCommit(
  message: string,
  options?: Partial<{ amend: boolean }>,
): Promise<void> {
  if (!COMMIT_REGEXP.test(message))
    throw `Message ${message} doesn't match the pattern`;

  await execute("git add --all", true);
  await execute(
    `git commit${!!options?.amend ? " --amend" : ""} -m "${message}" -n`,
    true,
    { excludeQuotes: true },
  );

  const remote = await getRemoteName();
  if (!remote) return;

  const branch = await getCurrentBranch();
  if (!branch) return;

  await execute(`git push -u ${remote} ${branch} --no-verify -f`, true);
}

export async function getInitialCommit(): Promise<string | undefined> {
  return await execute("git rev-list --max-parents=0 HEAD", false).then(
    (commit) => commit?.replace(EOL, "") || undefined,
  );
}

// <=============================== REMOTES ===============================> //

const REMOTE_URL_REGEXP =
  /^(.+?):\/\/(?:.+?:)?(?:.+?@)?(.+?)\/(.+?)\/(.+?).git$/;

export async function getRemoteName(): Promise<string | undefined> {
  return await execute("git remote", false).then(
    (remote) => remote?.replace(EOL, "") || undefined,
  );
}

export async function getRemoteURL(): Promise<string | undefined> {
  return await getRemoteName()
    .then((remote) =>
      !!remote ? execute(`git remote get-url ${remote}`, false) : undefined,
    )
    .then((remoteURL) => remoteURL?.replace(EOL, ""))
    .then((remoteURL) => {
      if (!remoteURL) return undefined;

      const matches = REMOTE_URL_REGEXP.exec(remoteURL);
      if (!matches || matches.length !== 5) return undefined;

      return `${matches[1]}://${matches[2]}/${matches[3]}/${matches[4]}`.toLowerCase();
    });
}

// <================================= TAGS =================================> //

const TAG_REGEXP = /^(?:(.+?)@)?v(\d+)\.(\d+)\.(\d+)(?:-temp)?$/;

export async function getTags(
  options?: Partial<{ merged: boolean; scope: string }>,
): Promise<string[]> {
  return await getDetailedTags(options).then((dts) => dts.map((dt) => dt.tag));
}

export async function getDetailedTags(
  options?: Partial<{ merged: boolean; scope: string }>,
): Promise<{ sha: string; tag: string }[]> {
  const tags = await execute("git fetch -p -P", true)
    .then(() =>
      execute(`git tag ${!!options?.merged ? " --merged" : ""}`, false),
    )
    .then((tags) => tags?.split(EOL) || [])
    .then((tags) => tags.filter(filterTags(options?.scope || "")))
    .then((tags) => tags.sort(sortTags));

  return await execute(`git rev-parse ${tags.join(" ")}`, false)
    .then((output) => output?.split(EOL) || [])
    .then((outputs) => outputs.filter((sha) => !!sha))
    .then((outputs) => outputs.map((sha, i) => ({ sha, tag: tags[i] })));
}

function filterTags(scope: string): Func<boolean, [tag: string]> {
  return (tag) => {
    try {
      const tagInfo = getTagInfo(tag);
      return tagInfo.scope === scope;
    } catch {
      return false;
    }
  };
}

function sortTags(tag1: string, tag2: string): number {
  const tagInfo1 = TAG_REGEXP.exec(tag1);
  const tagInfo2 = TAG_REGEXP.exec(tag2);

  if (!tagInfo1) throw `Tag ${tag1} doesn't match the pattern`;
  if (!tagInfo2) throw `Tag ${tag2} doesn't match the pattern`;

  for (let i = 2; i < 5; i++) {
    const result = +tagInfo2[i] - +tagInfo1[i];
    if (!result) continue;
    return -result;
  }

  return 0;
}

export function getTagInfo(tag: string): {
  major: number;
  minor: number;
  patch: number;
  scope: string;
} {
  const tagInfo = TAG_REGEXP.exec(tag);
  if (!tagInfo) throw `Tag ${tag} doesn't match the pattern`;
  return {
    major: +tagInfo[2],
    minor: +tagInfo[3],
    patch: +tagInfo[4],
    scope: tagInfo[1] || "",
  };
}

export async function createTag(tag: string): Promise<void> {
  if (!TAG_REGEXP.test(tag)) throw `Tag ${tag} doesn't match the pattern`;
  await execute(`git tag ${tag}`, true);

  const remote = await getRemoteName();
  if (!remote) return;

  await execute(`git push ${remote} ${tag} --no-verify`, true);
}

export async function deleteTag(tag: string): Promise<void> {
  await execute(`git tag --delete ${tag}`, true);

  const remote = await getRemoteName();
  if (!remote) return;

  await execute(`git push --delete ${remote} ${tag} --no-verify`, true);
}

// <================================ UTILS ================================> //

export async function checkout(sha: string): Promise<void> {
  await execute(`git checkout ${sha}`, true);
}

const REPOSITORY_DETAILS_REGEXP = /^(?:.+?):\/\/(?:.+?)\/(.+?)\/(.+?)$/;

export async function getRepositoryDetails(): Promise<
  { name: string; owner: string } | undefined
> {
  return await getRemoteURL().then((remoteURL) => {
    {
      if (!remoteURL) return undefined;

      const matches = REPOSITORY_DETAILS_REGEXP.exec(remoteURL);
      if (!matches || matches.length !== 3) return undefined;

      return { name: matches[2], owner: matches[1] };
    }
  });
}

export async function isInsideRepository(): Promise<boolean> {
  return await execute("git rev-parse --is-inside-work-tree", false)
    .then((result) => result === `true${EOL}`)
    .catch(() => false);
}
