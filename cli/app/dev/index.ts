import { spawnSync } from "node:child_process";
import transpileCode, { options as transpileOptions } from "../transpile";

export const options = transpileOptions;

export default Command<typeof options>(async (data) => {
	const { mode } = data;

	await transpileCode(data);

	Console.blue("Running CLI test command...");

	try {
		const result = spawnSync("node", ["./.mcmd/cli.ts", "test"], {
			stdio: "inherit",
		});

		if (result.error) {
			Console.red("Dev command failed!");
			throw result.error;
		}
	} catch (error) {
		Console.red("Dev command failed!");
		throw error;
	}
});
