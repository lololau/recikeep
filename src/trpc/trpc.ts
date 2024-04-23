import { TRPCError, initTRPC } from "@trpc/server";
import { validateRequest } from "recikeep/auth";
import { db } from "recikeep/database";
import superjson from "superjson";

export const createTRPCContext = async () => {
	const { session, user } = await validateRequest();
	return {
		db,
		session,
		user,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (ctx.session == null || ctx.user == null) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({ ctx: { session: ctx.session, user: ctx.user } });
});
