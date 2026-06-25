import type { Options as ParserOptions } from "yargs-parser";
import type { AnyZodObject, TypeOf } from "zod";

export type InferOptions<T extends AnyZodObject> = TypeOf<T>;

export const defineCommand = <T extends AnyZodObject, U>(
	df: (options: InferOptions<T>, beforeData?: U) => void | Promise<void>,
) => {
	return df;
};

export type DefineCommand<
	T extends AnyZodObject = AnyZodObject,
	U = unknown,
> = ReturnType<typeof defineCommand<T, U>>;

type Alphabets =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z";
export type Alias = Lowercase<Alphabets> | Uppercase<Alphabets>;

export type Options = AnyZodObject;
export type OptionsAlias = Record<string, keyof AnyZodObject>;

export type CommandStrings = (string | number)[];
export type CommandData = Record<string, any>;

export const defineConfig = (
	options: Partial<{
		parser: ParserOptions;
		hook: Partial<{
			extra: (
				commands: CommandStrings,
				data: CommandData,
			) => Promise<CommandData>;
			before: (commands: CommandStrings, data: CommandData) => Promise<unknown>;
			after: (commands: CommandStrings, data: CommandData) => Promise<void>;
		}>;
	}>,
) => options;

export type DefineConfig = typeof defineConfig;
