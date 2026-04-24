import chalk from "chalk";
import { pluginCode } from "mcmd/plugin";

console.log(chalk.blue("INFO"), "Running MCMD plugin to generate routes...");

try {
	await pluginCode({
		ignoreCLI: false,
		appDir: "./cli/app",
		outDir: "./cli/.mcmd",
	});

	console.log(chalk.green("SUCCESS"), "CLI built successfully");
} catch (error) {
	console.error(chalk.red("ERROR"), "Failed to build CLI:", error);
	process.exit(1);
}
