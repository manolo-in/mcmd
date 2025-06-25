import transpileCode, { options as transpileOptions } from "../transpile";

export const options = transpileOptions;

export default Command<typeof options>(async (data) => {
    const { mode } = data;

    await transpileCode(data)

    switch (mode) {
        case "bun": {
            if (!Bun) Console.red("Please install Bun JS Runtime");

            const { stdout } = Bun.spawnSync(["bun", "run", "./.mcmd/cli.ts", "test"], {
                // @ts-ignore
                "stdio": ["inherit"]
            });

            console.log(stdout.toString());

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
