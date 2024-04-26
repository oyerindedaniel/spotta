// import { authRouter } from "./router/auth.js"
import { postRouter } from "./router/post.js";
import { createTRPCRouter } from "./trpc.js";

export const appRouter = createTRPCRouter({
  // auth: authRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
