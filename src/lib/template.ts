export const template = (path: string) => `import Code, {
    // alias,
    // optionAlias,
    options,
} from "./app/${path}";

import { fromError, optionParser, trys } from "mcmd/engine";

const ArgsZod = optionParser({
    options: options.strict(),
    // aliases: optionAlias
});

export default async function (args: string[]) {
    const data = trys(() => ArgsZod.parse(args));

    if (data.isSuccess) await Code(data.data, {});
    else {
        const validationError = fromError(data.error);
        console.error(validationError.toString());
    }
}`;

export const newFilePath = (path: string) => path.split("/").join("__");

export const entryTemplate = (files: string[]) => `#!/usr/bin/env node

// import type { CommandTree } from "mcmd/engine.ts"
${files.map((f) => `import ${f.split(".")[0].replace("__index", "")} from "./${f}"`).join("\n")}

const args = process.argv.slice(2)
await index(args)
`;
