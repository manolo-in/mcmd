# MCMD - A Meta framework for building CLIs

Enjoy the developer experience of Nextjs but for CLI development.

### Usage

Install [MCMD package](https://npmjs.com/package/mcmd) from NPM

Or clone the ready-made template from [MCMD github](https://github.com/rajatsandeepsen/create-mcmd-app) repository
```bash
bun create mcmd-app --name my-cli
```

```bash
npx create mcmd-app --name my-cli
```


> [!WARNING]
> MCMD plugin isn't available on node.js right now. Make sure to use Bun for building the CLI

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
 ├── build.ts
 ├── .gitignore
 ├── README.md
 └── tsconfig.json
```

### Coding

```ts
// app/index.ts
import { z } from "zod";
import { defineCommand } from "mcmd";

export const options = z.object({
    name: z.string(), # npx my-cli --name Rajat
});

export default defineCommand<typeof options>(({ name }) => {
    console.log("Hi", name); // Hi Rajat
});
```

### Final Build

```ts
// build.ts
import { BunPlugin } from "mcmd/plugin";
import dts from "bun-plugin-dts";

Bun.build({
    entrypoints: ["./.mcmd/cli.ts"],
    packages: "external",
    target: "node",
    splitting: true,
    outdir: "./dist",
    plugins: [
        BunPlugin(), // plugin
        dts({
            output: {
                exportReferencedTypes: true,
                noBanner: true,
            },
        }),
    ],
});
```

```bash
bun run ./build.ts
```


### Publish CLI

```json
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
bun publish
```

### Enjoy CLI

```bash
bunx my-cli --name Rajat
```
