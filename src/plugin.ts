import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import chalk from "chalk";
import { buildRoutesFromAppDir, matchRoute } from "./lib/routing";
import { defaultConfig, entryTemplate, template } from "./lib/template";
import { transformCode, transformConfig, transformPath } from "./lib/transform";
import { createTree } from "./lib/tree";

const finalConfigFile = "mcmd.config.ts";

export async function pluginCode(
	options?: Partial<{
		ignoreCLI: boolean;
		javascript: boolean;
		appDir?: string;
		outDir?: string;
		shebang?: "bun" | "node";
		config?: string
	}>,
) {
	const appDir = options?.appDir || "./app";
	const outDir = options?.outDir || "./.mcmd";
	const configFileSrc = options?.config || "config.ts";
	let foundConfigFile = null

	// Build routes from app directory using unrouting
	const routes = buildRoutesFromAppDir(appDir);

	const entireFiles = [] as ReturnType<typeof transformPath>[];
	const treeData = {} as Record<string, string>;

	for (const [routeName, filePath] of Object.entries(routes)) {
		if (routeName === "/cli")
			throw new Error("File named ./cli is not allowed inside /app");

		const matched = matchRoute(routeName, routes);
		if (!matched) continue;

		if (matched.src === configFileSrc) {
			const configContent = readFileSync(matched.filePath, "utf-8").trim();
			if (configContent) {
				foundConfigFile = filePath;
				const newConfig = await transformConfig(configContent);
				const appOutputPath = join(outDir, finalConfigFile);
				mkdirSync(dirname(appOutputPath), { recursive: true });
				writeFileSync(appOutputPath, newConfig);
			}
			continue;
		}

		// Read file using Node.js fs
		const code = readFileSync(matched.filePath, "utf-8");
		const newCode = await transformCode(code);

		// Create directories and write files using Node.js fs
		const appOutputPath = join(outDir, "app", matched.src);
		mkdirSync(dirname(appOutputPath), { recursive: true });
		writeFileSync(appOutputPath, newCode);

		const newPath = transformPath(matched.src);

		const newParentCode = template(matched.src);
		const parentOutputPath = join(outDir, newPath.fileName);
		mkdirSync(dirname(parentOutputPath), { recursive: true });
		writeFileSync(parentOutputPath, newParentCode);

		entireFiles.push(newPath);
		treeData[newPath.commandName] = newPath.importName;
	}

	if (!options?.ignoreCLI) {
		const treeCode = JSON.stringify(
			createTree<string>(treeData),
			null,
			2,
		).replaceAll(/: "([^"]*)"/g, ": $1");

		if (!foundConfigFile) {
			const appOutputPath = join(outDir, finalConfigFile);
			mkdirSync(dirname(appOutputPath), { recursive: true });
			writeFileSync(appOutputPath, defaultConfig());
		}

		const cliOutputPath = join(outDir, "cli.ts");
		mkdirSync(dirname(cliOutputPath), { recursive: true });
		writeFileSync(
			cliOutputPath,
			entryTemplate(entireFiles, treeCode, options?.shebang),
		);
	}
}

export const plugin = (options?: Parameters<typeof pluginCode>[0]) => ({
	name: "mcmd",
	setup: async () => {
		await pluginCode(options);
		console.log(chalk.green("MCMD:"), "Building CLI completed");
	},
});

// Export for backwards compatibility
export const BunPlugin = plugin;
export const BunPluginCode = pluginCode;
