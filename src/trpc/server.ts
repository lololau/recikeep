import { cache } from "react";
import { createTRPCContext } from "./trpc";
import { createCaller } from ".";

const createContext = cache(async () => {
	return createTRPCContext();
});

export const api = createCaller(createContext);
