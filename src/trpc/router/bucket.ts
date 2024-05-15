import { z } from "zod";
import { SqliteError } from "better-sqlite3";
import { authenticationProcedure } from "../trpc";
import { first } from "radash";
import { buckets } from "recikeep/database/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

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
						.values({ recipeTitle, source })
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
	getBucketsByUserId: authenticationProcedure.query(async ({ ctx }) => {
		const bucketsList = await ctx.db.query.buckets.findMany({
			where: eq(buckets.userId, ctx.user.id),
		});

		return bucketsList;
	}),
};
