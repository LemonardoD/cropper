import { SSTConfig } from "sst";
import { FirstStack } from "./stacks/stack.js";

export default {
	config(_input) {
		return {
			name: "Cropper",
			region: process.env.AWS_SERVER,
		};
	},
	stacks(app) {
		app.stack(FirstStack);
	},
} satisfies SSTConfig;
