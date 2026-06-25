import { defineCommand } from "mcmd";
import type { AnyZodObject } from "zod";

export const options = z.object({}).passthrough();

export default defineCommand<AnyZodObject, string>(async (data, beforeData) => {
	Console.log("Data", data);
	Console.log("Before Data", beforeData);
	Console.green("Tested CLI");
});
