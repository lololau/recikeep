import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { users } from "recikeep/database/schema";
import { eq } from "drizzle-orm";

export const authRouter = {
	signUp: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z
					.string()
					.min(4, "Your password must have a minimal length of 4 characters."),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db
				.insert(users)
				.values({ email: input.email, password: input.password })
				.returning();
			return user[0];
		}),
	signIn: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z
					.string()
					.min(4, "Your password must have a minimal length of 4 characters."),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.query.users.findFirst({
				where: eq(users.email, input.email),
			});
			if (user?.password === input.password) {
				return user;
			}
			throw new TRPCError({
				message: "Email or password incorrect",
				code: "UNAUTHORIZED",
			});
		}),
} satisfies TRPCRouterRecord;
