import { AnyZodObject, TypeOf } from "zod";

export type InferOptions<T extends AnyZodObject> = TypeOf<T>;

export const defineCommand = <T extends AnyZodObject>(
    df: (options: InferOptions<T>, extra: any) => void | Promise<void>,
) => {
    return df;
};

export type Alias = string & { length: 1 };
export type DefineCommand = ReturnType<typeof defineCommand>
export type Options = AnyZodObject
export type OptionsAlias = Record<string, keyof AnyZodObject>
