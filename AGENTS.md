# React Essentials Monorepo Agents

This repository is a monorepo for React Essentials packages and CLI commands.
Use this file as a workspace-level reference for agents, scripts, package responsibilities, and general repository behavior.

## Workspace overview

- Root package: `@agusmgarcia/react-essentials`
- Workspaces: `packages/*`
- Main packages:
  - `packages/react-essentials-commands` — CLI command library and binaries for build/check/deploy/format/regenerate/start/test
  - `packages/react-essentials-store` — opinionated state manager utilities for React/NextJS and Azure functions
  - `packages/react-essentials-utils` — reusable utility library for React/NextJS and Azure functions

## Root scripts

The root workspace uses Turborepo to orchestrate package tasks.

- `npm run build` — run `turbo run build`
- `npm run check` — run `turbo run check`
- `npm run deploy` — run `turbo run deploy --concurrency 1`
- `npm run format` — run `turbo run format`
- `npm run test` — run `turbo run test`

Before completing each task, make sure to run `npm run check` at the top of the project.
When getting errors, first try to fix them automatically by running `npm run format` at the top of the project. If there are pending errors to fix, just do it manually.

These commands run across all packages in the monorepo according to `turbo.json` task definitions.

## Package command behavior

### `packages/react-essentials-commands`

This package provides the CLI implementation used by the other packages:

- `react-essentials-commands-build`
- `react-essentials-commands-check`
- `react-essentials-commands-deploy`
- `react-essentials-commands-format`
- `react-essentials-commands-regenerate`
- `react-essentials-commands-start`
- `react-essentials-commands-test`

It also contains source code for the command functions and helpers in `src/`.

### `packages/react-essentials-store`

- Exposes state management utilities and store classes
- Depends on `@agusmgarcia/react-essentials-utils`
- Uses `react-essentials-commands` CLI commands for build/check/format/test

### `packages/react-essentials-utils`

- Exposes utility functions and helpers
- Uses the shared commands package for build/check/format/test

## Essential repo conventions

- Node engine for workspace: `22.16.0` in root, package engine minimum `>=18.18.0`
- Package manager: `npm@10.9.2`
- Turborepo manages caching and task dependencies
- Build inputs include `src/**/*`, `package.json`, and `webpack.config.[jt]s`
- Outputs are produced in `bin` and `dist`

## Suggested agent focus areas

When working in this repo, prefer to:

- treat `packages/react-essentials-commands` as the CLI and task orchestration layer
- treat `packages/react-essentials-store` as the state management package
- treat `packages/react-essentials-utils` as the shared utility package
- use root commands for monorepo-wide operations
- inspect individual package `package.json` files for package-specific targets

## Helpful package details

`packages/react-essentials-commands` is the only package that defines its own build/check/deploy/format/test scripts directly. The other packages delegate those scripts to the CLI command package.

## Notes for agent usage

- There are no existing `.agent.md`, `*.instructions.md`, or `*.prompt.md` files in this repository yet.
- Use this `AGENTS.md` as the workspace-level reference for task and package context.
- If you add custom agent files later, place them under `.github/agents/` or the repository root depending on intended scope.
