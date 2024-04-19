import { appRouter } from "./root";
import { createCallerFactory, createTRPCContext } from "./trpc";

const createCaller = createCallerFactory(appRouter);

export { createTRPCContext, appRouter, createCaller };
