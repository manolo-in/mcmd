import { createUnimport } from "unimport";

export const defaultTransformation = (d: {
    // import: boolean;
    options: boolean;
    optionAlias: boolean;
    alias: boolean;
}) => {
    return "\n\n".concat(
        d.options ? "" : "export const options = z.object({});\n\n",
        d.optionAlias ? "" : "export const optionAlias = {} as const\n\n",
        d.alias ? "" : "export const alias = undefined\n\n",
    );
};

export const transformCode = async (codeString: string) => {
    const { injectImports } = createUnimport({
        imports: [
            { name: "z", from: "zod" },
            { name: "defineCommand", from: "mcmd" },
        ],
    });

    const hasOptions = codeString.includes("export const options =");
    const hasOptionAlias = codeString.includes("export const optionAlias =");
    const hasAlias = codeString.includes("export const alias =");

    const transformation = defaultTransformation({
        options: hasOptions,
        optionAlias: hasOptionAlias,
        alias: hasAlias,
    });

    return (await injectImports(transformation + codeString)).code;
};

export const transformPath = (path: string) => {
    const fileName = path.split("/").join("__")
    const commandName = path.split(".")[0].replaceAll("index", "__index__")

    return {
        path,
        fileName,
        importName: fileName.split(".")[0].replace("__index", ""),
        commandName
    }
}
