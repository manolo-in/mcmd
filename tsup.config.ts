import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts", "src/engine.ts"],
        format: ["cjs", "esm"],
        dts: true,
    },
    {
        entry: ["src/type.ts"],
        dts: true
    },
]);
