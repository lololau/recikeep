import { createServerSideHelpers } from "@trpc/react-query/server";
import { cache } from "react";
import SuperJSON from "superjson";
import { appRouter, createCaller } from ".";
import { createTRPCContext } from "./trpc";

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
