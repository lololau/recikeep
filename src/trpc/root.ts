import { authRouter } from "./router/auth";
import { bucketRouter } from "./router/bucket";
import { recipeRouter } from "./router/recipe";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	recipes: recipeRouter,
	auth: authRouter,
	buckets: bucketRouter,
});

export type AppRouter = typeof appRouter;
