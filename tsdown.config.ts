import { defineConfig } from "tsdown";

export default defineConfig([
	{
		entry: ["src/index.ts", "src/engine.ts", "src/type.ts"],
		format: ["cjs", "esm"],
		outDir: "dist",
		dts: {
			sourcemap: false,
		},
	},
	{
		entry: ["cli/.mcmd/cli.ts"],
		format: ["esm"],
		outDir: "bin",
		dts: {
			sourcemap: false,
		},
	},
]);
