import type { AnyZodObject, TypeOf } from "zod";

export type InferOptions<T extends AnyZodObject> = TypeOf<T>;

export const defineCommand = <T extends AnyZodObject>(
    df: (options: InferOptions<T>, extra?: any) => void | Promise<void>,
) => {
    return df;
};

export type DefineCommand<T extends AnyZodObject = AnyZodObject> = ReturnType<typeof defineCommand<T>>

type Alphabets = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
export type Alias = Lowercase<Alphabets> | Uppercase<Alphabets>

export type Options = AnyZodObject
export type OptionsAlias = Record<string, keyof AnyZodObject>
