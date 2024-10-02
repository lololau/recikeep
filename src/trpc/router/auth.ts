import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { SqliteError } from "better-sqlite3";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { first } from "radash";
import { users } from "recikeep/database/schema";
import { z } from "zod";
import { authenticationProcedure, publicProcedure } from "../trpc";

export const authRouter = {
	// new account
	signUp: publicProcedure
		.input(
			z.object({
				email: z.string().email(),
				password: z
					.string()
					.min(4, "Your password must have a minimal length of 4 characters."),
				pseudo: z.string(),
				isPublic: z.boolean(),
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
						.values({
							email: input.email,
							password: hashPassword,
							pseudo: input.pseudo,
							isPublic: input.isPublic,
						})
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
	getMe: authenticationProcedure.query(async ({ ctx }) => {
		return ctx.user;
	}),

	// update informations about connected user
	updateMe: authenticationProcedure
		.input(
			z.object({
				pseudo: z.string(),
				isPublic: z.boolean(),
				personalPicture: z.string().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { pseudo, isPublic, personalPicture } = input;

			const userId = ctx.user.id;

			return await ctx.db.transaction(async (tx) => {
				// Get user by id
				const userFound = first(
					await tx
						.update(users)
						.set({
							pseudo,
							isPublic,
							personalPicture,
						})
						.where(eq(users.id, userId))
						.returning(),
				);

				if (userFound == null) {
					tx.rollback();
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "user not found by id",
					});
				}
			});
		}),
} satisfies TRPCRouterRecord;
