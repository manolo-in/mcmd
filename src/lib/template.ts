export const template = (
	path: string,
) => `import Code, { options } from "./app/${path}";
import { CommandData } from "mcmd";
import { runCommand } from "mcmd/engine";

export default async function (args: CommandData, beforeData: unknown) {
	await runCommand(Code, args, options, beforeData)
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
import { getFromTree, mainParser, runHook, mergeObjects } from "mcmd/engine"
import mcmdConfig from "./mcmd.config.ts"

${files.map((f) => `import ${f.importName} from "./${f.fileName}"`).join("\n")}

const tree = ${tree}

const args = process.argv.slice(2);

const { _: commands, ...data } = mainParser(args, mcmdConfig.parser);

const beforeData = await runHook(mcmdConfig?.hook?.before, commands, data);
const extendedData = await runHook(mcmdConfig?.hook?.extra, commands, data);

const mergedData = mergeObjects(extendedData, data)

const cmdFunction = getFromTree(commands, tree);
await cmdFunction(mergedData, beforeData);

await runHook(mcmdConfig?.hook?.after, commands, mergedData);
`;

export const defaultConfig = () => `import { defineConfig } from 'mcmd';

export default defineConfig({
	parser: {},
	hook: {}
})
`;
