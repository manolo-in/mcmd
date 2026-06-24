import type Zod from "zod";
import type { DefineCommand, DefineConfig } from "./lib/define";
import type { ConsoleType } from "./lib/utils";

declare global {
	const z: typeof Zod;
	function Command<T extends Zod.AnyZodObject = Zod.AnyZodObject, U = unknown>(
		data: DefineCommand<T, U>,
	): any;
	const Console: ConsoleType;
	const defineConfig: DefineConfig;
}
