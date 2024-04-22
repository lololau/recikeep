import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { users } from "recikeep/database/schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";

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
			const hashedPassword = await new Argon2id().hash(input.password);

			const user = await ctx.db
				.insert(users)
				.values({ email: input.email, password: hashedPassword })
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

			if (user == null) {
				throw new TRPCError({
					message: "Email or password incorrect",
					code: "UNAUTHORIZED",
				});
			}

			const validPassword = await new Argon2id().verify(
				user.password,
				input.password,
			);
			if (!validPassword) {
				throw new TRPCError({
					message: "Email or password incorrect",
					code: "UNAUTHORIZED",
				});
			}

			return { id: user.id, email: user.email };
		}),
} satisfies TRPCRouterRecord;
