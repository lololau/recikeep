import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { authenticationProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { users } from "recikeep/database/schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

export const authRouter = {
	// new account
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
			// new argon2Id instance
			const argon2Id = new Argon2id();
			const hashPassword = await argon2Id.hash(input.password);

			const user = await ctx.db
				.insert(users)
				.values({ email: input.email, password: hashPassword })
				.returning();
			return user[0];
		}),

	// login
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
			if (user == null) {
				throw new TRPCError({
					message: "Email or password incorrect",
					code: "UNAUTHORIZED",
				});
			}
			const argon2Id = new Argon2id();
			const isPasswordValid = await argon2Id.verify(
				user.password,
				input.password,
			);

			if (!isPasswordValid) {
				throw new TRPCError({
					message: "Email or password incorrect",
					code: "UNAUTHORIZED",
				});
			}

			return user;
		}),

	// get informations about connected user
	getMe: authenticationProcedure.query(async ({ ctx }) => {}),
} satisfies TRPCRouterRecord;
