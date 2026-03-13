import { EOL } from "os";
import path from "path";
import process from "process";

import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { git, npm } from "#src/modules";

export default createFileMiddleware<string>({
  path: ".github/CHANGELOG.md",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

async function getTemplate(
  context: CreateFileMiddlewareTypes.Context,
): Promise<string> {
  let fragments = "";

  const scope = await npm.getMonorepoDetails().then((m) => m?.name);

  if (await git.isInsideRepository()) {
    const [remoteURL, detailedTags, detailedCommits] = await Promise.all([
      git.getRemoteURL(),
      git.getDetailedTags({ merged: true, scope }),
      git.getDetailedCommits({
        path: [
          process.cwd(),
          ...context.paths.map((p) => path.resolve(process.cwd(), p)),
        ],
      }),
    ]);

    fragments = detailedTags
      .map((tag, index) => {
        const initialCommitIndex =
          detailedCommits.findIndex(
            (dc) => dc.sha === detailedTags[index - 1]?.sha,
          ) + 1;

        const lastCommitIndex = detailedCommits.findIndex(
          (dc) => dc.sha === tag.sha,
        );

        const commits = detailedCommits
          .slice(
            initialCommitIndex,
            detailedCommits[lastCommitIndex].commit ===
              "chore: bump package version"
              ? lastCommitIndex
              : lastCommitIndex + 1,
          )
          .map((c) => ({
            createdAt: c.createdAt,
            ...git.getCommitInfo(c.commit),
          }))
          .reverse();

        const breakingChangeCommits = commits
          .filter((c) => c.isBreakingChange)
          .map(transformCommit)
          .join(EOL);

        const featureCommits = commits
          .filter((c) => c.type === "feat" && !c.isBreakingChange)
          .map(transformCommit)
          .join(EOL);

        const fixCommits = commits
          .filter((c) => c.type === "fix" && !c.isBreakingChange)
          .map(transformCommit)
          .join(EOL);

        const choreCommits = commits
          .filter(
            (c) =>
              (c.type === "chore" || c.type === "refactor") &&
              !c.isBreakingChange,
          )
          .map(transformCommit)
          .join(EOL);

        const date = detailedCommits[
          lastCommitIndex
        ].createdAt.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          timeZone: "UTC",
          year: "numeric",
        });

        const tagValue = tag.tag.replace("-temp", "");

        return `## ${!!remoteURL ? `[${tagValue.replace(`${scope}@`, "")}](${remoteURL}/tree/${tagValue})` : tagValue.replace(`${scope}@`, "")}

> ${date}
${!breakingChangeCommits && !featureCommits && !fixCommits && !choreCommits ? `${EOL}- No compatible changes to show${EOL}` : ""}
${!!breakingChangeCommits ? `### Breaking changes ❗️${EOL}${EOL}${breakingChangeCommits}${EOL}` : ""}
${!!featureCommits ? `### Features ✅${EOL}${EOL}${featureCommits}${EOL}` : ""}
${!!fixCommits ? `### Fixes 🎯${EOL}${EOL}${fixCommits}${EOL}` : ""}
${!!choreCommits ? `### Chores ⚙️${EOL}${EOL}${choreCommits}${EOL}` : ""}`;
      })
      .reverse()
      .join(EOL);
  }

  return `# Changelog

All notable changes to this project will be documented in this file.
${!fragments ? "" : `${EOL}${fragments}`}`;
}

function transformCommit({
  message,
  scope,
}: ReturnType<typeof git.getCommitInfo>): string {
  return `- ${!!scope ? `**${scope}**: ` : ""}${message}`;
}
