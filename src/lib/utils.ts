import chalk from "chalk";
import { marked } from "marked";
import { markedTerminal } from "marked-terminal";
import prompts from "prompts";

// @ts-ignore
marked.use(markedTerminal());

export const Console = {
    ...console,
    md: (text: string) => console.log(marked(text)),
    prompts,
    green: (text: string) => console.log(chalk.green(text)),
    red: (text: string) => console.log(chalk.red(text)),
    blue: (text: string) => console.log(chalk.blue(text)),
};

export type ConsoleType = typeof Console
