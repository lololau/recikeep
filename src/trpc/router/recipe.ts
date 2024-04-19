import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";

export const recipeRouter = {
	getRecipes: publicProcedure.query(({ ctx }) => {
		return { message: "hello world", recipes: [] };
	}),
} satisfies TRPCRouterRecord;
