import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./root";

export const sleep = async (time: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};

export type RouterOutput = inferRouterOutputs<AppRouter>;
