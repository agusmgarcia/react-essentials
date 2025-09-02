import { files, properties } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<Record<string, any>>({
  mapOutput: (output) =>
    properties.sort(output, [
      "name",
      "run-name",
      "description",
      "permissions",
      "defaults",
      "on",
      "concurrency",
      "env",
      "jobs",
      "jobs.*.name",
      "jobs.*.needs",
      "jobs.*.runs-on",
      "jobs.*.uses",
      "jobs.*.secrets",
      "jobs.*.with",
      "jobs.*.outputs",
      "jobs.*.steps.*.name",
      "jobs.*.steps.*.if",
      "jobs.*.steps.*.continue-on-error",
      "jobs.*.steps.*.timeout-minutes",
      "jobs.*.steps.*.id",
      "jobs.*.steps.*.uses",
      "jobs.*.steps.*.with",
      "jobs.*.steps.*.run",
      "jobs.*.steps.*.shell",
      "jobs.*.steps.*.env",
      "jobs.*.steps.*.working-directory",
    ]),
  path: ".github/workflows/release.yml",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function releaseMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteWorkflowFiles(context)]);
}

async function deleteWorkflowFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile(
      ".github/workflows/continuous-integration-and-deployment.yml",
    ),
    files.removeFile(".github/workflows/deploy-app.yml"),
    files.removeFile(".github/workflows/deploy-azure-func.yml"),
    files.removeFile(".github/workflows/deploy-node-func.yml"),
    files.removeFile(".github/workflows/publish-lib.yml"),
  ]);
}

function getTemplate(context: Context): Record<string, any> {
  return context.core === "app"
    ? {
        concurrency: {
          "cancel-in-progress": true,
          group: "${{ github.workflow }}",
        },
        jobs: {
          "release-app": {
            name: "Release app",
            secrets: {
              "github-auth-token": "${{ secrets.GITHUB_TOKEN }}",
              "node-auth-token": "${{ secrets.GITHUB_TOKEN }}",
            },
            uses: getReusableWorkflowPath(context),
          },
        },
        name: "Release",
        on: {
          push: {
            tags: getTags(context),
          },
          workflow_dispatch: null,
        },
        permissions: "write-all",
        "run-name": "Release ${{ github.ref_name }}",
      }
    : context.core === "azure-func"
      ? {
          concurrency: {
            "cancel-in-progress": true,
            group: "${{ github.workflow }}",
          },
          jobs: {
            "release-azure-func": {
              name: "Release Azure func",
              secrets: {
                "azure-client-id": "${{ secrets.AZURE_CLIENT_ID }}",
                "azure-creds": "${{ secrets.AZURE_CREDS }}",
                "azure-subscription-id": "${{ secrets.AZURE_SUBSCRIPTION_ID }}",
                "azure-tenant-id": "${{ secrets.AZURE_TENANT_ID }}",
                "node-auth-token": "${{ secrets.GITHUB_TOKEN }}",
              },
              uses: getReusableWorkflowPath(context),
              with: {
                "azure-allow-no-subscriptions":
                  "${{ vars.AZURE_ALLOW_NO_SUBSCRIPTIONS }}",
                "azure-app-name": "${{ vars.AZURE_APP_NAME }}",
                "azure-audience": "${{ vars.AZURE_AUDIENCE }}",
                "azure-auth-type": "${{ vars.AZURE_AUTH_TYPE }}",
                "azure-environment": "${{ vars.AZURE_ENVIRONMENT }}",
              },
            },
          },
          name: "Release",
          on: {
            push: {
              tags: getTags(context),
            },
            workflow_dispatch: null,
          },
          permissions: "write-all",
          "run-name": "Release ${{ github.ref_name }}",
        }
      : context.core === "lib"
        ? {
            concurrency: {
              "cancel-in-progress": true,
              group: "${{ github.workflow }}-${{ github.ref_name }}",
            },
            jobs: {
              "release-lib": {
                name: "Release lib",
                secrets: {
                  "node-auth-token": "${{ secrets.GITHUB_TOKEN }}",
                },
                uses: getReusableWorkflowPath(context),
              },
            },
            name: "Release",
            on: {
              push: {
                tags: getTags(context),
              },
            },
            permissions: "write-all",
            "run-name": "Release ${{ github.ref_name }}",
          }
        : {
            concurrency: {
              "cancel-in-progress": true,
              group: "${{ github.workflow }}",
            },
            jobs: {
              "release-node": {
                name: "Release node",
                secrets: {
                  "node-auth-token": "${{ secrets.GITHUB_TOKEN }}",
                },
                uses: getReusableWorkflowPath(context),
              },
            },
            name: "Release",
            on: {
              push: {
                tags: getTags(context),
              },
              workflow_dispatch: null,
            },
            permissions: "write-all",
            "run-name": "Release ${{ github.ref_name }}",
          };
}

function getTags(context: Context): string[] {
  if (context.essentialsCommands) return ["**@v[0-9]+.[0-9]+.[0-9]+"];
  return ["**@?v[0-9]+.[0-9]+.[0-9]+"];
}

function getReusableWorkflowPath(context: Context): string {
  const path = `.github/workflows/release-${context.core}.yml`;
  if (context.essentialsCommands) return `./${path}`;
  return `${context.essentialsName.replace(/^@/, "")}/${path}@v${context.essentialsCommandsVersion}`;
}
