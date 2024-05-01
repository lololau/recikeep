import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { authenticationProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { users } from "recikeep/database/schema";
import { eq } from "drizzle-orm";
import { SqliteError } from "better-sqlite3";
import { Argon2id } from "oslo/password";
import { first } from "radash";

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

			try {
				const user = first(
					await ctx.db
						.insert(users)
						.values({ email: input.email, password: hashPassword })
						.returning(),
				);

				if (user == null) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "User insert but not return?",
					});
				}

				return user;
			} catch (err) {
				if (err instanceof SqliteError) {
					if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
						throw new TRPCError({
							code: "CONFLICT",
							message: "Email already exists.",
						});
					}
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: err.message,
					});
				}
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}
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
