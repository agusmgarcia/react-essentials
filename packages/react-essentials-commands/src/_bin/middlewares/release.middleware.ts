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
      "jobs.*.runs-on",
      "jobs.*.steps.name",
      "jobs.*.steps.if",
      "jobs.*.steps.continue-on-error",
      "jobs.*.steps.timeout-minutes",
      "jobs.*.steps.id",
      "jobs.*.steps.uses",
      "jobs.*.steps.with",
      "jobs.*.steps.run",
      "jobs.*.steps.shell",
      "jobs.*.steps.env",
      "jobs.*.steps.working-directory",
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
  // TODO: the release is created assuming you may use TurboRepo for handling monorepo project.
  // This is not compatible with Nx nor NPM packages.
  const baseSteps = [
    {
      if: "${{ github.event_name == 'workflow_dispatch' && github.ref_type != 'tag' }}",
      name: "Check if the type is 'tag'",
      run: 'echo "::error::Workflow needs to be dispatched from a tag"\nexit 1\n',
      shell: "bash",
    },
    {
      name: "Checkout",
      uses: "actions/checkout@v4",
    },
    {
      name: "Setup Node",
      uses: "actions/setup-node@v4",
      with: {
        cache: "npm",
        "node-version": 22.16,
      },
    },
    {
      env: {
        NODE_AUTH_TOKEN:
          "${{ secrets.NODE_AUTH_TOKEN || secrets.GITHUB_TOKEN }}",
      },
      name: "Install dependencies",
      run: "npm ci --ignore-scripts --no-fund",
      shell: "bash",
    },
    {
      id: "get-scope-from-tag",
      name: "Get scope from tag",
      uses: "frabert/replace-string-action@v2",
      with: {
        pattern: "^(?:(.+?)@)?v(\\d+)\\.(\\d+)\\.(\\d+)$",
        "replace-with": "$1",
        string: "${{ github.ref_name }}",
      },
    },
    {
      id: "get-package-location",
      if: "${{ steps.get-scope-from-tag.outputs.replaced }}",
      name: "Get package location",
      run:
        "value=$(npm query .workspace | jq -r --arg pkg_name '${{steps.get-scope-from-tag.outputs.replaced }}' '.[] | select(.name == $pkg_name) | .location')\n" +
        'echo "value=${value}" >> "$GITHUB_OUTPUT"\n',
      shell: "bash",
    },
    {
      id: "get-version-from-tag",
      name: "Get version from tag",
      uses: "frabert/replace-string-action@v2",
      with: {
        pattern: "^(?:(.+?)@)?v(\\d+)\\.(\\d+)\\.(\\d+)$",
        "replace-with": "$2.$3.$4",
        string: "${{ github.ref_name }}",
      },
    },
    {
      id: "extract-version-from-package",
      name: "Extract version from package",
      run:
        "value=$(jq .version package.json -r)\n" +
        'echo "value=${value}" >> "$GITHUB_OUTPUT"\n',
      shell: "bash",
      "working-directory": "${{ steps.get-package-location.outputs.value }}",
    },
    {
      if: "${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}",
      name: "Verify versions match",
      run:
        'echo "::error::Version in the package.json (${{ steps.extract-version-from-package.outputs.value }}) and tag (${{ steps.get-version-from-tag.outputs.replaced }}) don\'t match"\n' +
        "exit 1\n",
      shell: "bash",
    },
    {
      name: "Check",
      run: "npm run check -- --filter=${{steps.get-scope-from-tag.outputs.replaced }}",
      shell: "bash",
    },
    {
      name: "Test",
      run: "npm test -- --filter=${{steps.get-scope-from-tag.outputs.replaced }}",
      shell: "bash",
    },
  ];

  return context.core === "app"
    ? {
        concurrency: {
          "cancel-in-progress": true,
          group: "${{ github.workflow }}",
        },
        jobs: {
          "deploy-app": {
            name: "Deploy app",
            "runs-on": "ubuntu-latest",
            steps: [
              ...baseSteps,
              {
                env: {
                  NEXT_PUBLIC_APP_VERSION:
                    "${{ steps.get-version-from-tag.outputs.replaced }}",
                  NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}",
                },
                name: "Build",
                run: "npm run build -- --filter=${{steps.get-scope-from-tag.outputs.replaced }}",
                shell: "bash",
              },
              {
                name: "Configure pages",
                uses: "actions/configure-pages@v5",
                with: {
                  token: "${{ secrets.GITHUB_TOKEN }}",
                },
              },
              {
                name: "Upload build artifact",
                uses: "actions/upload-pages-artifact@v3",
                with: {
                  path: "${{ steps.get-package-location.outputs.value || '.' }}/dist",
                },
              },
              {
                name: "Deploy to GitHub Pages",
                uses: "actions/deploy-pages@v4",
                with: {
                  token: "${{ secrets.GITHUB_TOKEN }}",
                },
              },
            ],
          },
        },
        name: "Release",
        on: {
          push: {
            tags: ["**@?v[0-9]+.[0-9]+.[0-9]+"],
          },
          workflow_dispatch: null,
        },
        permissions: "write-all",
      }
    : context.core === "azure-func"
      ? {
          concurrency: {
            "cancel-in-progress": true,
            group: "${{ github.workflow }}",
          },
          jobs: {
            "deploy-azure-func": {
              name: "Deploy Azure func",
              "runs-on": "ubuntu-latest",
              steps: [
                ...baseSteps,
                {
                  name: "Build",
                  run: "npm run build -- --filter=${{steps.get-scope-from-tag.outputs.replaced }}",
                  shell: "bash",
                },
                {
                  id: "azure-login",
                  name: "Azure login",
                  uses: "azure/login@v2",
                  with: {
                    "allow-no-subscriptions":
                      "${{ vars.AZURE_ALLOW_NO_SUBSCRIPTIONS }}",
                    audience: "${{ vars.AZURE_AUDIENCE }}",
                    "auth-type": "${{ vars.AZURE_AUTH_TYPE }}",
                    "client-id": "${{ secrets.AZURE_CLIENT_ID }}",
                    creds: "${{ secrets.AZURE_CREDS }}",
                    environment: "${{ vars.AZURE_ENVIRONMENT }}",
                    "subscription-id": "${{ secrets.AZURE_SUBSCRIPTION_ID }}",
                    "tenant-id": "${{ secrets.AZURE_TENANT_ID }}",
                  },
                },
                {
                  name: "Add app settings",
                  uses: "azure/appservice-settings@v1",
                  with: {
                    "app-name": "${{ vars.AZURE_APP_NAME }}",
                    "app-settings-json":
                      '[\n  {\n    "name": "APP_VERSION",\n    "value": "${{ steps.get-version-from-tag.outputs.replaced }}",\n    "slotSetting": false\n  },\n  {\n    "name": "FUNCTIONS_EXTENSION_VERSION",\n    "value": "~4",\n    "slotSetting": false\n  },\n  {\n    "name": "FUNCTIONS_WORKER_RUNTIME",\n    "value": "node",\n    "slotSetting": false\n  },\n  {\n    "name": "WEBSITE_NODE_DEFAULT_VERSION",\n    "value": "~22.16.0",\n    "slotSetting": false\n  }\n]\n',
                  },
                },
                {
                  env: {
                    NODE_AUTH_TOKEN:
                      "${{ secrets.NODE_AUTH_TOKEN || secrets.GITHUB_TOKEN }}",
                  },
                  name: "Install dependencies for production",
                  run: "npm ci --ignore-scripts --no-audit --no-fund --omit=dev",
                  shell: "bash",
                },
                // TODO: test if this actions finds the azure function even if it is under a monorepo
                {
                  name: "Deploy function",
                  uses: "azure/functions-action@v1",
                  with: {
                    "app-name": "${{ vars.AZURE_APP_NAME }}",
                    "respect-funcignore": true,
                  },
                },
                {
                  if: "${{ always() && steps.azure-login.conclusion == 'success' }}",
                  name: "Azure logout",
                  run: "az logout",
                  shell: "bash",
                },
              ],
            },
          },
          name: "Release",
          on: {
            push: {
              tags: ["**@?v[0-9]+.[0-9]+.[0-9]+"],
            },
            workflow_dispatch: null,
          },
          permissions: "write-all",
        }
      : context.core === "lib"
        ? {
            concurrency: {
              "cancel-in-progress": true,
              group: "${{ github.workflow }}-${{ github.ref_name }}",
            },
            jobs: {
              "publish-lib": {
                name: "Publish lib",
                "runs-on": "ubuntu-latest",
                steps: [
                  ...baseSteps,
                  {
                    env: {
                      NODE_AUTH_TOKEN:
                        "${{ secrets.NODE_AUTH_TOKEN || secrets.GITHUB_TOKEN }}",
                    },
                    name: "Publish",
                    run: "npm publish",
                    shell: "bash",
                    "working-directory":
                      "${{ steps.get-package-location.outputs.value }}",
                  },
                ],
              },
            },
            name: "Release",
            on: {
              push: {
                tags: ["**@?v[0-9]+.[0-9]+.[0-9]+"],
              },
            },
            permissions: "write-all",
          }
        : {
            concurrency: {
              "cancel-in-progress": true,
              group: "${{ github.workflow }}",
            },
            jobs: {
              "deploy-node": {
                name: "Deploy node",
                "runs-on": "ubuntu-latest",
                steps: [
                  ...baseSteps,
                  {
                    env: {
                      APP_VERSION:
                        "${{ steps.get-version-from-tag.outputs.replaced }}",
                    },
                    name: "Build",
                    run: "npm run build -- --filter=${{steps.get-scope-from-tag.outputs.replaced }}",
                    shell: "bash",
                  },
                ],
              },
            },
            name: "Release",
            on: {
              push: {
                tags: ["**@?v[0-9]+.[0-9]+.[0-9]+"],
              },
              workflow_dispatch: null,
            },
            permissions: "write-all",
          };
}
