import { TRPCError, initTRPC } from "@trpc/server";
import { validateRequest } from "recikeep/auth/auth";
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

export const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

// public procedure
export const publicProcedure = t.procedure;

// middleware authentication
export const isAuthentified = t.middleware(({ ctx, next }) => {
	if (ctx.session == null || ctx.user == null) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({ ctx: { session: ctx.session, user: ctx.user } });
});

export const authenticationProcedure = t.procedure.use(isAuthentified);

// middleware to log
export const loggedProcedure = authenticationProcedure.use(async (opts) => {
	const start = Date.now();

	const result = await opts.next();

	const durationMs = Date.now() - start;
	const meta = { path: opts.path, type: opts.type, durationMs };

	result.ok
		? console.log("OK request timing:", meta)
		: console.error("Non-OK request timing", meta);

	return result;
});
