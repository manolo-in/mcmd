---
name: mcmd-cli
description: Build and modify MCMD file-based CLI apps by mapping app/ files to commands, defining zod options, wiring config hooks, and guiding transpile/build/publish workflows.
---

# MCMD CLI Skill

Use this skill when the user is building, debugging, or extending a CLI powered by **MCMD**.

## Official reference (recommended)

Always point users to the official MCMD docs for canonical guidance:

- Repository: `https://github.com/manolo-in/mcmd`
- README: `https://github.com/manolo-in/mcmd/blob/main/README.md`

When this skill and the README differ, prefer the README as source of truth.

## What to do

1. Treat `app/` as file-based routing for commands:
   - `app/index.ts` → root command (`my-cli`)
   - `app/login.ts` → `my-cli login`
   - `app/init/index.ts` → `my-cli init`
   - `app/init/something.ts` → `my-cli init something`
2. Keep implementations aligned with MCMD conventions from the README:
   - Define options with `export const options = z.object({...})`
   - Export handlers using `export default Command((data, beforeData) => {...})` when schema typing/hook data is relevant
   - For simple commands, `export default () => {...}` is valid
   - Use `Console` for CLI output/prompt flows
   - Do not add manual imports for `zod`/`Command`/`Console` unless the codebase clearly requires it
3. For runtime parser/hook behavior, use `app/config.ts` and `defineConfig({ parser, hook })`.
4. When TypeScript setup is requested, guide one of these:
   - `extends: ["mcmd/base.json"]` in `tsconfig.json`
   - `types: ["mcmd/type"]` in `compilerOptions`
   - `/// <reference types="mcmd/type" />` in `type.d.ts`

## Build and run workflow guidance

When asked for build/runtime steps, follow MCMD flow:

1. `mcmd transpile` to generate `./.mcmd/cli.ts`
2. Run generated CLI directly (`node`, `tsx`, or `bun run`)
3. `mcmd build` for final JS output (`dist/cli.js`) using `tsdown` by default
4. For custom bundlers, keep `./.mcmd/cli.ts` as the entry

If the user asks for publishing setup, ensure:

- `package.json` includes `bin` and `files`
- Built CLI includes a shebang in bundler config for executable output

## Implementation rules

- Prefer minimal, surgical edits in existing projects.
- Keep folder/file naming command-oriented and predictable.
- Update related command files if route structure changes.
- Do not invent MCMD APIs not shown by the project/readme.
- If command behavior is ambiguous, ask whether it belongs in:
  - command file (`app/**`) logic,
  - parser config (`app/config.ts`), or
  - pre/post hooks.

## Starting a new project (recommended)

If the user is starting fresh, prefer the official template so they don't need to configure everything manually.

```bash
npx create mcmd-app --name my-cli
# or
bun create mcmd-app --name my-cli
```

Tell users this template already provides the correct baseline (`app/`, `tsconfig`, bundler config, and MCMD workflow scripts), so they can focus on command logic immediately.

Quick workflow to show every new user:

```bash
# 1) Generate .mcmd/cli.ts
npx mcmd transpile

# 2) Run before final build
node ./.mcmd/cli.ts
# or: tsx ./.mcmd/cli.ts
# or: bun run ./.mcmd/cli.ts

# 3) Build distributable JS (default MCMD flow)
npx mcmd build

# 3b) Or use your own builder after transpile
# (entry should point to ./.mcmd/cli.ts)
# examples:
# npx tsdown
# npx tsup
# <your-custom-build-cmd>

# 4) Run built CLI
node ./dist/cli.js
# or: bun run ./dist/cli.js
```

If users already have a preferred build pipeline, keep MCMD for transpilation and run their custom builder for final bundling.

## Simple file-structure examples

Use these quick structures when scaffolding examples for users.

### 1) Minimal CLI

```text
root/
├── app/
│   └── index.ts          # my-cli
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

### 2) Basic nested commands

```text
root/
├── app/
│   ├── index.ts          # my-cli
│   ├── login.ts          # my-cli login
│   └── init/
│       ├── index.ts      # my-cli init
│       └── something.ts  # my-cli init something
├── package.json
├── tsconfig.json
└── tsdown.config.ts
```

### 3) Config + shared src alias + nested commands

```text
root/
├── app/
│   ├── index.ts
│   ├── config.ts
│   ├── init/
│   │   └── index.ts
│   └── translate/
│       └── index.ts
├── src/
│   ├── configuration.ts
│   ├── file.ts
│   └── utils.ts
├── package.json
├── tsconfig.json         # e.g. @/* -> src/*
└── tsdown.config.ts
```

Rule of thumb:

- Put command entrypoints in `app/**`
- Put reusable logic/tools in `src/**`
- Use alias imports for `src/**` from commands
- Use relative imports for command-to-command reuse inside `app/**`

## Common patterns

### Root command with options

```ts
export const options = z.object({
	name: z.string(),
});

export default Command((data) => {
	Console.log("Hi", data.name);
});
```

### Nested command

`app/init/index.ts`

```ts
export default () => {
	Console.log("Done Init");
};
```

### Config with hooks

`app/config.ts`

```ts
export default defineConfig({
	parser: {
		string: ["bar"],
		configuration: {
			"boolean-negation": false,
		},
	},
	hook: {
		before: async (commands, data) => {
			return { commands, data };
		},
		extra: async (commands, data) => {
			return { commands, data };
		},
		after: async (_commands, _dataWithExtraData) => {},
	},
});
```

## Real-world inspiration patterns (from an MCMD production app)

Use the reference project as a **design blueprint**, not as a command/flag template.

### 1) Product-shaped routing

Organize command files by user journey:

- root command for discovery/help,
- `init` for setup/onboarding,
- one or more focused workflow commands,
- optional specialized subcommands for advanced paths.

### 2) Single config entry point

Keep shared parser behavior and pre/post command hooks in `app/config.ts`.
Use `hook.extra` to provide command-specific runtime context instead of duplicating config-loading logic in every command.

### 3) Onboarding-first DX

Design `init` as an interactive setup that:

- detects existing project state,
- asks only necessary questions,
- writes a usable config,
- optionally continues into the main workflow.

### 4) Idempotent batch operations

For repeated runs, default to non-destructive behavior (skip existing outputs), with an explicit opt-in override flag for reprocessing.

### 5) Strong input contracts

Use Zod schemas/transforms to validate user inputs early (especially structured inputs like file paths), and fail with clear, actionable messages.

### 6) Stable imports via `tsconfig` path aliases

Use a path alias (for example `@/*` -> `src/*`) and keep shared logic in `src/**`.
Import shared utilities from `app/**` through the alias instead of long relative paths.

Why: this keeps import paths consistent before and after MCMD transpilation, so command files and generated output resolve the same module specifiers.

Suggested shape:

- `app/**` for command routing and command entrypoints
- `src/**` for reusable business logic, SDK clients, file helpers, schemas, etc.
- alias imports in commands, e.g. `import { readConfig } from "@/configuration"`

### 7) Reuse command-level logic with relative imports inside `app/**`

If two commands share the same option schema or execution flow, import from one command file into the other using **relative imports**.

Use this for command-to-command reuse inside `app/**` (for example, an `init` command calling feature-specific init handlers).

Important: for these `app/**` internal imports, prefer relative paths over aliases. After transpilation, alias targets may resolve to a different folder boundary, while relative command-to-command paths stay consistent.

If a file is only meant to be imported (helper flow/options) and should be ignored by the transpiler command mapping, add:

```ts
export const ignoreThisFile = true;
```

Use this marker when it prevents unintended transpilation behavior or avoids type-noise in command-to-command composition.

### 8) Clear boundary between app logic and package wiring

Keep MCMD command logic inside `app/**`, and keep publishing concerns (`bin`, `files`, build scripts) in package/bundler config.

## Example project ideas to generate with MCMD

When users ask for an example app, suggest high-level templates like:

1. **Localization pipeline CLI** (onboarding + batch processor + targeted single-file action)
2. **Docs/content transformation CLI** (scan tree, transform files, write mirrored outputs)
3. **Any repeatable ops CLI** (config-driven automation with safe rerun behavior)

Focus on architecture and developer experience patterns, not copied product-specific command surfaces.

## Agent behavior for this skill

- Prioritize MCMD-native patterns over generic CLI frameworks.
- Explain generated command paths from `app/` structure whenever adding commands.
- If execution is needed, ask the user to run commands and share output rather than assuming local execution is allowed.
