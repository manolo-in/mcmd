import { entryTemplate, newFilePath, template } from "./lib/template";
import { transformCode } from "./lib/transform";

export async function BunPlugin() {
    const router = new Bun.FileSystemRouter({
        style: "nextjs",
        dir: "./app",
        fileExtensions: [".ts"],
    });

    const entireFiles = [];

    for (const [name, path] of Object.entries(router.routes)) {
        if (name === "/cli")
            throw new Error("File named ./cli is not allowed inside /app");

        const file = router.match(name);
        if (!file) continue;

        const code = await Bun.file(file.filePath).text();
        const newCode = await transformCode(code);

        await Bun.file("./.mcmd/app/" + file.src).write(newCode);

        const newPath = newFilePath(file.src);
        await Bun.file("./.mcmd/" + newPath).write(template(file.src));

        entireFiles.push(newPath);
    }

    await Bun.file("./.mcmd/cli.ts").write(entryTemplate(entireFiles));
}

export const Plugin = async (runtime:"bun" | "node" = "bun") => {
    if (runtime !== "bun") throw new Error(`Plugin for ${runtime} isn't available yet`)

    await BunPlugin()
}
