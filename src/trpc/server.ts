import { cache } from "react";
import { createTRPCContext } from "./trpc";
import { appRouter, createCaller } from ".";
import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";

const createContext = cache(async () => {
	return createTRPCContext();
});

export async function createServerHelper() {
	return createServerSideHelpers({
		router: appRouter,
		ctx: await createTRPCContext(),
		transformer: SuperJSON,
	});
}

export const api = createCaller(createContext);
