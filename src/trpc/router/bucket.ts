import { TRPCError } from "@trpc/server";
import { SqliteError } from "better-sqlite3";
import { eq } from "drizzle-orm";
import { first } from "radash";
import { buckets } from "recikeep/database/schema";
import { z } from "zod";
import { authenticationProcedure, loggedProcedure } from "../trpc";

export const bucketRouter = {
	// new bucket
	createBucket: authenticationProcedure
		.input(
			z.object({
				recipeTitle: z.string(),
				source: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { recipeTitle, source } = input;

			try {
				const bucket = first(
					await ctx.db
						.insert(buckets)
						.values({ recipeTitle, source, userId: ctx.user.id })
						.returning(),
				);

				if (bucket == null) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Bucket insert but not return?",
					});
				}

				return bucket;
			} catch (err) {
				if (err instanceof SqliteError) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: err.message,
					});
				}
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}
		}),
	getBucketsByUserId: loggedProcedure.query(async ({ ctx }) => {
		const bucketsList = await ctx.db.query.buckets.findMany({
			where: eq(buckets.userId, ctx.user.id),
		});

		return bucketsList;
	}),

	deleteBucketById: authenticationProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(buckets).where(eq(buckets.id, input)).returning();
		}),
};
