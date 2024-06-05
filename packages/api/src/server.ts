import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from ".";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  return createTRPCContext({
    headers: heads,
  });
});

export const api = createCaller(createContext);
