import dts from "bun-plugin-dts";
import chalk from "chalk";

await Bun.build({
    entrypoints: ["./src/plugin.ts"],
    packages: "external",
    target: "bun",
    outdir: "./dist",
    splitting: true,
    plugins: [
        dts({
            output: {
                exportReferencedTypes: true,
                noBanner: true,
            },
        }),
    ],
});

console.log(chalk.green("ESM"), "dist\\plugin.js  ", chalk.green("Done"));
console.log(chalk.blue("DTS"), "dist\\plugin.d.ts", chalk.blue("Done"));

// For building CLI with MCMD
const { stdout } = Bun.spawnSync(["bun", "run", "./build.ts"], {
    cwd: "./cli",
});
console.log(stdout.toString());

console.log(chalk.green("ESM"), "dist\\cli.js  ", chalk.green("Done"));
console.log(chalk.blue("DTS"), "dist\\cli.d.ts", chalk.blue("Done"));

await Bun.file("./dist/base.json").write(
    await Bun.file("./src/base.json").text(),
);
console.log(chalk.green("TS"), "dist\\base.json", chalk.green("Done"));
