import { authRouter } from "./router/auth";
import { recipeRouter } from "./router/recipe";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	recipes: recipeRouter,
	auth: authRouter,
});

export type AppRouter = typeof appRouter;
