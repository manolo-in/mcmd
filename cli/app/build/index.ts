import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import transpileCode, { options as transpileOptions } from "../transpile";

export const options = transpileOptions;

export default Command<typeof options>(async (data) => {
	await transpileCode(data);

	Console.blue("Building CLI with tsdown...");
	mkdirSync("./dist", { recursive: true });

	try {
		execSync("tsdown", {
			stdio: "inherit",
		});
		Console.green("Build completed successfully!");
	} catch (error) {
		Console.red("Build failed!");
		throw error;
	}
});
