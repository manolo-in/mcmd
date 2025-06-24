import { BunPlugin as BunPluginType } from "bun";
import { entryTemplate, template } from "./lib/template";
import { transformCode, transformPath } from "./lib/transform";
import { createTree } from "./lib/tree";
import chalk from "chalk";

export async function BunPluginCode(
    options?: Partial<{
        ignoreCLI: boolean;
        javascript: boolean;
    }>,
) {
    const router = new Bun.FileSystemRouter({
        style: "nextjs",
        dir: "./app",
        fileExtensions: [".ts"],
    });

    const entireFiles = [];
    const treeData = {} as Record<string, string>;

    for (const [name, path] of Object.entries(router.routes)) {
        if (name === "/cli")
            throw new Error("File named ./cli is not allowed inside /app");

        const file = router.match(name);
        if (!file) continue;

        const code = await Bun.file(file.filePath).text();
        const newCode = await transformCode(code);

        await Bun.file("./.mcmd/app/" + file.src).write(newCode);

        const newPath = transformPath(file.src);

        const newParentCode = template(file.src);
        await Bun.file("./.mcmd/" + newPath.fileName).write(newParentCode);

        entireFiles.push(newPath);
        treeData[newPath.commandName] = newPath.importName;
    }

    if (!options?.ignoreCLI) {
        const treeCode = JSON.stringify(
            createTree<string>(treeData),
            null,
            2,
        ).replaceAll(/: "([^"]*)"/g, ": $1");

        await Bun.file("./.mcmd/cli.ts").write(
            entryTemplate(entireFiles, treeCode),
        );
    }
}

export const BunPlugin = (
    options?: Parameters<typeof BunPluginCode>[0],
): BunPluginType => ({
    name: "mcmd",
    setup: async () => {
        await BunPluginCode(options);
        console.log(chalk.green("MCMD"), "Done building");
    },
});
