import { defineConfig } from "mcmd";

export default defineConfig({
	parser: {},
	hook: {
		before: async (commands, data) => {},
		after: async (commands, data) => {},
	},
});
