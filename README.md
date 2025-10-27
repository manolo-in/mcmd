# MCMD - A Meta framework for building CLIs

Enjoy the DX of File Based Routing (eg: NextJs) for CLI development.

### Usage

Install [MCMD package](https://npmjs.com/package/mcmd) from NPM

Or clone the ready-made template from [MCMD github](https://github.com/manolo-in/create-mcmd-app) repository
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

Don't need to import `zod` or `Command`, we'll handle everything for you.

```ts
// app/index.ts

export const options = z.object({
    name: z.string()
});

export default Command((data) => {
    const { name } = data;
    console.log("Hi", name);
});

// npx my-cli --name Rajat
```

```ts
// app/init.ts

export default () => {
    console.log("Done Init");
};

// npx my-cli init
```

### Final Build

> [!IMPORTANT]
> Make sure to use Bun for building the CLI.

```bash
bun --bun run build

# or
# bunx --bun mcmd build
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

> [!TIP]
> Now you don't strictly need bun to run your CLI.

```bash
bunx my-cli --name Rajat

# or
npx my-cli --name Rajat
```

### TypeScript Support

Extends you `tsconfig.json` with `mcmd/base.json`
```json
{
    // tsconfig.json
    compilerOptions: {},
    "include": ["."],
    "exclude": [
        "dist",
        "node_modules"
    ],
    "extends": [
      "mcmd/base.json" // important
    ]
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
    name: z.string()
});

export default Command<typeof options>((data) => {
    const { name } = data;
    console.log("Hi", name);
});
```
