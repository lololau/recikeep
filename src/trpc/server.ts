import { cache } from "react";
import { createCaller } from ".";
import { createTRPCContext } from "./trpc";

const createContext = cache(async () => {
	return createTRPCContext();
});

export const api = createCaller(createContext);
