import { initTRPC } from "@trpc/server";
import { db } from "recikeep/database";
import superjson from "superjson";

export const createTRPCContext = () => {
	return {
		db,
	};
};

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
