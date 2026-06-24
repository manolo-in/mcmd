<a href="https://github.com/manolo-in/mcmd">
    <img alt="cover" src="https://github.com/manolo-in/mcmd/blob/main/cover.png?raw=true" />
</a>

# MCMD - A Meta framework for building CLIs tools

> MCMD short name for Meta Framework for Command. 
> Inspired from Next.JS (Meta Framework for React.JS)

Enjoy the DX of File Based Routing for CLI development with zod validation and TypeScript support out of the box.

### Usage

Install [MCMD package](https://npmjs.com/package/mcmd) from NPM

Or clone the ready-made template from [MCMD github](https://github.com/manolo-in/create-mcmd-app) repository

```bash
npx create mcmd-app --name my-cli
```

```bash
bun create mcmd-app --name my-cli
```

### Folder Structure

```
root
 ├── .mcmd
 ├── node_modules
 │
 ├─┬ app
 │ ├── index.ts          # npx my-cli
 │ ├─┬ init
 │ │ ├── something.ts    # npx my-cli init something
 │ │ └── index.ts        # npx my-cli init
 │ └── login.ts          # npx my-cli login
 │
 ├── package.json
 ├── .gitignore
 ├── README.md
 ├── tsconfig.json
 └── tsdown.config.ts    # default bundler
```

### Coding

Don't need to import `zod` or `Command`, we'll handle everything for you.

```ts
// app/index.ts

export const options = z.object({
	name: z.string(),
});

export default Command((data) => {
	const { name } = data;
	Console.log("Hi", name);
});

// npx my-cli --name Rajat
```

```ts
// app/init.ts

export default () => {
	// a custom console with colors and prompts support
	Console.log("Done Init");
};

// npx my-cli init
```

### Usage

Transpile the code (dev mode)
```bash
npx mcmd transpile
```

Run the CLI before converting to javascript
```bash
node ./.mcmd/cli.ts --name Rajat

# or
tsx ./.mcmd/cli.ts --name Rajat
bun run ./.mcmd/cli.ts --name Rajat
```

Build the CLI
```bash
npx mcmd build
```

Run the CLI after converting to javascript
```bash
node ./dist/cli.js --name Rajat

# or
bun run ./dist/cli.js --name Rajat
```

### Final Build

```bash
npx mcmd build

# or, split the work
npx mcmd transpile
npx tsdown
```

> [!IMPORTANT]
> Make sure to have a bundler config file for tsdown before building

```ts
// tsdown.config.ts

import { defineConfig } from "tsdown";

export default defineConfig([
	{
		entry: ["./.mcmd/cli.ts"],
		format: ["esm"],
		outDir: "bin",
		dts: false,
		banner: {
			js: "#!/usr/bin/env node",
		},
	},
]);
```

### Publish CLI

```jsonc
// package.json
{
    "name": "my-cli",
    "version": "0.0.0",
    "bin": "./dist/cli.js",
    "files": ["dist/**/*"],
    ...
}
```

```bash
npm login
npm publish
```

### Enjoy CLI

```bash
bunx my-cli --name Rajat

# or
npx my-cli --name Rajat
```

### TypeScript Support

Extends you `tsconfig.json` with `mcmd/base.json`
```jsonc
{
	// tsconfig.json
	"compilerOptions": {},
	"extends": ["mcmd/base.json"]
}
```

Or directly use `mcmd/type` in `tsconfig.json`
```jsonc
{
	// tsconfig.json
	"compilerOptions": {
		"types": ["mcmd/type"]
	}
}
```

Or paste this code to `./type.d.ts`
```ts
// Don't remove this.
// This helps for automatic type assigning for MCMD.
/// <reference types="mcmd/type" />
```

Follow this code to get full TypeScript support
```ts
// app/index.ts
export const options = z.object({
	name: z.string(),
});

export default Command<typeof options, {}>((data, beforeData) => {
	const { name } = data;
	Console.log("Hi", name); 
});
```

### Configuration

Create the file `config.ts` inside the `app` folder and paste this.

```ts
export default defineConfig({
	// paste your parser config here
	// eg
	parser: {
		string: ['bar'], 
		configuration: {
			'boolean-negation': false
		}
	},
	// custom hook for before and after running the command
	hook: {
		after: async (commands, data) => {},
		
		// before, but after parsing the arguments
		before: async (commands, data) => {
			return beforeData; // access this ↴
		},
		// export default Command((data, beforeData) => {})
	},
});
```

- [yargs-parser](https://github.com/yargs/yargs-parser#configuration)


### BYOB - Bring Your Own Bundler

By default, `mcmd` do the transpiling and [`tsdown`](https://tsdown.dev/) take care of final bundling.

You can customize it by bringing your own bundler like [`tsup`](https://tsup.egoist.dev/) or [`unbuild`](https://unjs.io/packages/unbuild)

```bash
npx mcmd transpile
```

```ts
// tsup.config.ts

import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./.mcmd/cli.ts"], // entry point of mcmd
	format: ["esm"],
	outDir: "bin",
	dts: false,
	banner: {
		js: "#!/usr/bin/env node",
	},
});
```

```bash
npx tsup
```

### References

MCMD is built on top of some amazing libraries, you can directly use them in your code without installing them separately.

- [zod](https://zod.dev/)
- [tsdown](https://tsdown.dev/)
- [yargs-parser](https://github.com/yargs/yargs-parser)
- [prompts](https://github.com/terkelg/prompts)
- [marked-terminal](https://github.com/mikaelbr/marked-terminal)
