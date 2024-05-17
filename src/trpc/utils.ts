import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./root";

export type RouterOutput = inferRouterOutputs<AppRouter>;
