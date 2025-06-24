import { CommandTree, mainParser } from "./src/engine";
import { createTree, getFromTree } from "./src/engine";


const tree = {
    __index__: "1",
    a: {
        __index__: "a",
        b: {
            __index__: "b",
        },
    },
} satisfies CommandTree<string>;



const treeData = {
    __index__: "root", // Root index
    a: "a_value", // a.index
    "a/b": "b_value", // a.b.index
    "a/b/c": "c_value", // a.b.c.index
    "x/y": "y_value", // x.y.index
};

const newTree = createTree(treeData);

const args = process.argv.slice(2);

const { _: commands, ...data } = mainParser(args);

console.log(newTree);
console.log(getFromTree(commands, newTree));
