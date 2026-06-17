export const template = (path: string) => `import Code, {
    // alias,
    // optionAlias,
    options,
} from "./app/${path}";

import { fromError, getHelp, optionParser, trys } from "mcmd/engine";

export default async function (args: unknown) {
    const help = getHelp(args, options)
    if (help) return;

    const data = trys(() => options.parse(args));

    if (data.isSuccess) await Code
        // @ts-ignore
        (data.data, {});
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
	shebang?: "bun" | "node",
) => `${shebang ? `#!/usr/bin/env ${shebang}\n` : ""}
import { getFromTree, mainParser } from "mcmd/engine"
import mcmdConfig from "./mcmd.config.ts"

${files.map((f) => `import ${f.importName} from "./${f.fileName}"`).join("\n")}

const tree = ${tree}

const args = process.argv.slice(2);

const { _: commands, ...data } = mainParser(args, mcmdConfig.parser);

const cmdFunction = getFromTree(commands, tree)

await cmdFunction(data)
`;

export const defaultConfig = () => `import { defineConfig } from 'mcmd';
export default defineConfig({
	parser: {}
})
`
