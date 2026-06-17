import { pluginCode } from "mcmd/plugin";

export const options = z.object({
	mode: z.enum(["node", "bun", "deno"]).default("node").describe("Specify javascript runtime to use"),
	"show-shebang": z.boolean().default(false).describe("To set the shebang on top of CLI entry path, default is false")
});

export default Command<typeof options>(async (data) => {
	const { mode, ...options } = data;

	switch (mode) {
		case "node": {
			Console.blue("Transpiling for Node.js...");
			await pluginCode(options["show-shebang"] ? {
				shebang: "node"
			} : undefined);
			Console.green("Transpilation completed!");
			return;
		}
		case "bun": {
			Console.blue("Transpiling for Bun.js...");
			await pluginCode(options["show-shebang"] ? {
				shebang: "bun"
			} : undefined);
			Console.green("Transpilation completed!");
			return;
		}
		case "deno": {
			Console.warn("Support Deno.js is coming soon");
			return;
		}
		default: {
			Console.red(
				"Unknown mode provided",
			);
			return;
		}
	}
});
