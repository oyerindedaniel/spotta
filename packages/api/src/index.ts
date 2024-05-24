import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";
import type { OurFileRouter } from "./router/uploadthing/core";
import { appRouter } from "./root";
import { ourFileRouter } from "./router/uploadthing/core";
import { GET, POST } from "./router/uploadthing/route";
import { createCallerFactory, createTRPCContext } from "./trpc";

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export {
  GET,
  POST,
  appRouter,
  createCaller,
  createTRPCContext,
  ourFileRouter,
  type OurFileRouter,
};
export type { AppRouter, RouterInputs, RouterOutputs };

export * from "./config";
