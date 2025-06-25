import type { CommandTree } from "../engine";

// const treeData = {
//     __index__: "root",
//     a: "a_value",
//     "a/b": "b_value",
//     "a/b/c": "c_value",
//     "x/y": "y_value",
// };

// const tree = {
//     __index__: index,
//     login: {
//         __index__: login
//     },
//     init: {
//         __index__: init,
//         login: {
//             __index__: init__login,
//         },
//     },
// } // satisfies CommandTree

export const createTree = <T extends any>(data: Record<string, T>): CommandTree<T> => {
    const tree = {} as CommandTree<T>;

    for (const [path, func] of Object.entries(data)) {
        let currentNode = tree;

        if (path === "" || path === "__index__") {
            currentNode["__index__"] = func;
            continue;
        }

        const keys = path.split("/");

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i] as string

            if (i === keys.length - 1) {
                if (!currentNode[key]) {
                    if (key === "__index__") currentNode["__index__"] = func
                    else currentNode[key] = { __index__: func } as CommandTree<T>;
                } else {
                    if (key === "__index__") currentNode["__index__"] = func
                    else (currentNode[key] as CommandTree<T>).__index__ = func;
                }
            } else {
                if (!currentNode[key]) {
                    currentNode[key] = {} as CommandTree<T>;
                }
                currentNode = currentNode[key] as CommandTree<T>;
            }
        }
    }

    return tree;
};

export const getFromTree = <T extends any>(
    commands: (string | number)[],
    tree: CommandTree<T>,
): T => {
    if (commands.length === 0) {
        if (!tree.__index__) throw new Error("Command not found");

        return tree.__index__;
    }

    let subTree = tree;

    for (const cmd of commands) {
        if (!(cmd in subTree)) throw new Error("Command not found");

        subTree = subTree[cmd] as CommandTree<T>;
    }
    if (!subTree) throw new Error("Command not found");

    if (!subTree.__index__) throw new Error("Command not found");

    return subTree.__index__;
};
