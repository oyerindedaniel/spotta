import { amenityRouter } from "./router/amenity";
import { areaRouter } from "./router/area";
import { authRouter } from "./router/auth";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  area: areaRouter,
  amenity: amenityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
