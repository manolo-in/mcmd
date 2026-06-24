import parser from "yargs-parser";
import { type AnyZodObject, z } from "zod";
import type { CommandStrings } from "./lib/define";

export { fromError } from "zod-validation-error";
export { argumentParser as optionParser } from "zodcli";
export { createTree, getFromTree } from "./lib/tree";

export const mainParser = parser;

export type CommandFunction = (args: string[]) => Promise<void>;

export type CommandTree<T = CommandFunction> = {
	__index__?: T;
} & {
	[k in string as k extends "__index__" ? never : k]: T | CommandTree<T>;
};

export const trys = <T, U = Error>(
	func: () => T,
):
	| {
			error: U;
			isSuccess: false;
	  }
	| {
			data: T;
			isSuccess: true;
	  } => {
	try {
		const result = func();
		return {
			data: result,
			isSuccess: true,
		};
	} catch (error) {
		return {
			error: error as U,
			isSuccess: false,
		};
	}
};

export const getHelp = (args: unknown, options: AnyZodObject) => {
	const help = z
		.object({
			h: z.boolean(),
			help: z.boolean(),
		})
		.partial()
		.parse(args);

	if (help.h || help.help) {
		console.log(options.description ?? "Get Help");
		return true;
	}

	return false;
};

export const runHook = async (
	hook:
		| ((commands: CommandStrings, data: object) => Promise<unknown>)
		| undefined,
	commands: CommandStrings,
	data: object,
) => {
	if (!hook) return;
	try {
		return await hook(commands, data);
	} catch (error) {
		console.error("Error in hook:", error);
	}
};
