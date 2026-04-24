import { pluginCode } from "mcmd/plugin";

export const options = z.object({
    mode: z.enum(["node"]).default("node"),
});

export default Command<typeof options>(async (data) => {
    const { mode } = data;

    switch (mode) {
        case "node": {
            Console.blue("Transpiling with Node.js...");
            await pluginCode();
            Console.green("Transpilation completed!");
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
