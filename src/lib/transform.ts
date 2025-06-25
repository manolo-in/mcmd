import { createUnimport } from "unimport";

export const defaultTransformation = (d: {
    ignoreTransform: boolean,
    options: boolean;
    optionAlias: boolean;
    alias: boolean;
}) => {
    if (d.ignoreTransform) return ""

    return "\n\n".concat(
        d.options ? "" : "export const options = z.object({});\n\n",
        d.optionAlias ? "" : "export const optionAlias = {} as const;\n\n",
        d.alias ? "" : "export const alias = undefined;\n\n",
        "type OptionsZod = typeof options;\n",
        "const Command = <T extends OptionsZod = OptionsZod>(\n",
        "...data: Parameters<typeof defineCommand<T>>\n",
        ") => defineCommand<T>(...data);\n\n",
    );
};

export const transformCode = async (codeString: string) => {
    const { injectImports } = createUnimport({
        imports: [
            { name: "z", from: "zod" },
            { name: "defineCommand", from: "mcmd" },
            { name: "Console", from: "mcmd" },
        ],
    });

    const ignoreTransform = codeString.includes("export const ignoreThisFile = true")
    const hasOptions = codeString.includes("export const options =");
    const hasOptionAlias = codeString.includes("export const optionAlias =");
    const hasAlias = codeString.includes("export const alias =");

    const transformation = defaultTransformation({
        ignoreTransform,
        options: hasOptions,
        optionAlias: hasOptionAlias,
        alias: hasAlias,
    });

    return (await injectImports(transformation + codeString)).code;
};

export const transformPath = (path: string) => {
    const fileName = path.split("/").join("__")
    const commandName = (path.split(".")[0] as string).replaceAll("index", "__index__")

    return {
        path,
        fileName,
        importName: (fileName.split(".")[0] as string).replace("__index", ""),
        commandName
    }
}
