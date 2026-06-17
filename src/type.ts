import type { DefineCommand, DefineConfig } from "./lib/define";
import type { ConsoleType } from "./lib/utils";
import Zod from "zod";

declare global {
	const z: typeof Zod;
	function Command<T extends Zod.AnyZodObject = Zod.AnyZodObject>(
		data: DefineCommand<T>,
	): any;
	const Console: ConsoleType;
	const defineConfig: DefineConfig;
}
