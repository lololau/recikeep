import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./root";

export const sleep = async (time: number) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, time);
	});
};

export function timeoutPromise(ms: number, promise: Promise<void>) {
	const timeout = new Promise((resolve, reject) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			reject(new Error(`Timed out in ${ms}ms.`));
		}, ms);
	});

	return Promise.race([promise, timeout]);
}

export type RouterOutput = inferRouterOutputs<AppRouter>;
