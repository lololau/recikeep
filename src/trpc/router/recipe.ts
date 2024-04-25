import type { TRPCRouterRecord } from "@trpc/server";
import { authenticationProcedure } from "../trpc";
import { z } from "zod";

export const recipeRouter = {
	getRecipes: authenticationProcedure.query(({ ctx }) => {
		return { message: "hello world", recipes: [] };
	}),
} satisfies TRPCRouterRecord;
