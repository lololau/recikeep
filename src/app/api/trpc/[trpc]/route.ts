import { createServerSideHelpers } from "@trpc/react-query/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "recikeep/trpc";
import SuperJSON from "superjson";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
	res.headers.set("Access-Control-Allow-Origin", "*");
	res.headers.set("Access-Control-Request-Method", "*");
	res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
	res.headers.set("Access-Control-Allow-Headers", "*");
};

export async function createServerHelper() {
	return createServerSideHelpers({
		router: appRouter,
		ctx: await createTRPCContext(),
		transformer: SuperJSON,
	});
}

export const OPTIONS = () => {
	const response = new Response(null, {
		status: 204,
	});
	setCorsHeaders(response);
	return response;
};

const handler = async (req: Request) => {
	const response = await fetchRequestHandler({
		endpoint: "/api/trpc",
		router: appRouter,
		req,
		createContext: () => createTRPCContext(),
		onError({ error, path }) {
			console.error(`>>> tRPC Error on '${path}'`, error);
		},
	});

	setCorsHeaders(response);
	return response;
};

export { handler as GET, handler as POST };
