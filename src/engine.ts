import parser from "yargs-parser";

export { fromError } from "zod-validation-error";
export { argumentParser as optionParser } from "zodcli";
export { getFromTree, createTree } from "./lib/tree";

export const mainParser = parser;

export type CommandFunction = (args: string[]) => Promise<void>;

export type CommandTree<T extends any = CommandFunction> = {
    __index__?: T;
} & {
    [k in string as k extends "__index__" ? never : k]: T | CommandTree<T>;
};

export const trys = <T, U = Error>(
    func: () => T,
):
    | {
          error: U;
          isSuccess: false;
      }
    | {
          data: T;
          isSuccess: true;
      } => {
    try {
        const result = func();
        return {
            data: result,
            isSuccess: true,
        };
    } catch (error) {
        return {
            error: error as U,
            isSuccess: false,
        };
    }
};
