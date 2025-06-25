import dts from "bun-plugin-dts";
import { BunPlugin } from "mcmd/plugin";

await Bun.build({
    entrypoints: ["./.mcmd/cli.ts"],
    packages: "external",
    target: "node",
    splitting: true,
    outdir: "../dist",
    plugins: [
        BunPlugin(),
        dts({
            output: {
                exportReferencedTypes: true,
                noBanner: true,
            },
        }),
    ],
});
