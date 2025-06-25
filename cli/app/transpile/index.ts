import { BunPluginCode } from "mcmd/plugin";

export const options = z.object({
    mode: z.enum(["bun", "node"]).default("bun"),
});

export default Command<typeof options>(async (data) => {
    const { mode } = data;

    switch (mode) {
        case "bun": {
            if (!Bun) Console.red("Please install Bun JS Runtime");

            await BunPluginCode();
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
