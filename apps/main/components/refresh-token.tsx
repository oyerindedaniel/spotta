"use client";

import { useEffect, useRef } from "react";
import { User } from "@prisma/client";

import { useSessionStore } from "@repo/hooks/src/use-session-store";
import { api } from "@repo/trpc/src/react";
import { startTokenRefreshTimer, stopTokenRefreshTimer } from "@repo/utils";

export function RefreshToken({ session }: { session: User | null }) {
  const {
    data: { refreshToken, ttl },
  } = useSessionStore();

  const { mutateAsync } = api.auth.refreshToken.useMutation();

  const isAuthenticated = useRef(!!session);

  //TODO: consider when page is reload. with current implementation timer stop.

  useEffect(() => {
    if (!isAuthenticated.current && session) {
      isAuthenticated.current = true;
      startTokenRefreshTimer({
        refreshToken,
        expirationTime: ttl!,
        mutateRefreshToken: mutateAsync,
      });
    } else if (isAuthenticated.current && !session) {
      isAuthenticated.current = false;
      stopTokenRefreshTimer();
    }
  }, [isAuthenticated.current, session]);

  return null;
}
