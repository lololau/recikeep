import { recipeRouter } from "./router/recipe";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	recipes: recipeRouter,
});

export type AppRouter = typeof appRouter;
