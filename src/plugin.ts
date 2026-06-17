import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import chalk from "chalk";
import { buildRoutesFromAppDir, matchRoute } from "./lib/routing";
import { entryTemplate, template } from "./lib/template";
import { transformCode, transformPath } from "./lib/transform";
import { createTree } from "./lib/tree";

export async function pluginCode(
	options?: Partial<{
		ignoreCLI: boolean;
		javascript: boolean;
		appDir?: string;
		outDir?: string;
		shebang?: "bun" | "node";
	}>,
) {
	const appDir = options?.appDir || "./app";
	const outDir = options?.outDir || "./.mcmd";

	// Build routes from app directory using unrouting
	const routes = buildRoutesFromAppDir(appDir);

	const entireFiles = [] as ReturnType<typeof transformPath>[];
	const treeData = {} as Record<string, string>;

	for (const [routeName, filePath] of Object.entries(routes)) {
		if (routeName === "/cli")
			throw new Error("File named ./cli is not allowed inside /app");

		const matched = matchRoute(routeName, routes);
		if (!matched) continue;

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
