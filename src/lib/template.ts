export const template = (path: string) => `import Code, {
    // alias,
    // optionAlias,
    options,
} from "./app/${path}";

import { fromError, optionParser, trys } from "mcmd/engine";

export default async function (args: unknown) {
    const data = trys(() => options.parse(args));

    if (data.isSuccess) await Code(data.data, {});
    else {
        const validationError = fromError(data.error);
        console.error(validationError.toString());
    }
}`;

type FileData = {
    path: string;
    fileName: string;
    importName: string;
    commandName: string;
};

export const entryTemplate = (
    files: FileData[],
    tree: string,
) => `#!/usr/bin/env node

import { getFromTree, mainParser } from "mcmd/engine"

${files.map((f) => `import ${f.importName} from "./${f.fileName}"`).join("\n")}

const tree = ${tree}


const args = process.argv.slice(2);

const { _: commands, ...data } = mainParser(args);

const cmdFunction = getFromTree(commands, tree)

await cmdFunction(data)

`;
