import parser from "yargs-parser";
import { type AnyZodObject, z } from "zod";
import { fromError } from "zod-validation-error";
import type { CommandData, CommandStrings, DefineCommand } from "./lib/define";

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
		process.exit(1);
	}
};

const isObject = (value: unknown): value is Record<string, unknown> => {
	return value !== null && typeof value === "object" && !Array.isArray(value);
};

export const mergeObjects = (obj1: unknown, obj2: unknown): object => {
	const first = isObject(obj1) ? obj1 : {};
	const second = isObject(obj2) ? obj2 : {};
	return {
		...first,
		...second,
	};
};

export const runCommand = async <OP extends AnyZodObject>(
	Code: DefineCommand<OP, any>,
	args: CommandData,
	options: OP,
	beforeData: unknown,
) => {
	const help = getHelp(args, options);
	if (help) return;

	const data = trys(() => options.parse(args));

	if (data.isSuccess) await Code(data.data, beforeData);
	else {
		const validationError = fromError(data.error);
		console.error(validationError.toString());
	}
};
