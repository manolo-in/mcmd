import dts from "bun-plugin-dts";
import { BunPluginCode } from "mcmd/plugin";
import transpileCode, { options as transpileOptions } from "../transpile";

export const options = transpileOptions;

export default Command<typeof options>(async (data) => {
    const { mode } = data;

    await transpileCode(data)

    switch (mode) {
        case "bun": {
            if (!Bun) Console.red("Please install Bun JS Runtime");

            await Bun.build({
                entrypoints: ["./.mcmd/cli.ts"],
                packages: "external",
                target: "node",
                splitting: true,
                outdir: "./dist",
                plugins: [
                    dts({
                        output: {
                            exportReferencedTypes: true,
                            noBanner: true,
                        },
                    }),
                ],
            });

            return;
        }
        default: {
            Console.red(
                "Dev command is only available for Bun envirnment right now",
            );

            return;
        }
    }
});
