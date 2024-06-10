"use client";

import { useEffect, useRef } from "react";

import { api } from "@repo/api/src/react";
import { useInitialRender, useSessionStore } from "@repo/hooks";
import { UserDTO } from "@repo/types";
import { startTokenRefreshTimer, stopTokenRefreshTimer } from "@repo/utils";

export function RefreshToken({ session }: { session: UserDTO }) {
  const initialRenderComplete = useInitialRender();

  const {
    data: { refreshToken, ttl },
    updateData,
  } = useSessionStore();

  const isInitialized = useRef(false);
  const isAuthenticated = useRef(!!session);

  const { mutateAsync } = api.auth.refreshToken.useMutation();
  const { mutateAsync: mutateAsyncResumeSession } =
    api.auth.resumeSession.useMutation();

  //TODO: refactor change to usequery

  useEffect(() => {
    if (!isAuthenticated.current && session) {
      isAuthenticated.current = true;
      isInitialized.current = true;
      startTokenRefreshTimer({
        refreshToken,
        expirationTime: ttl!,
        mutateRefreshToken: mutateAsync,
      });
    } else if (isAuthenticated.current && !session) {
      isAuthenticated.current = false;
      isInitialized.current = true;
      stopTokenRefreshTimer();
    }
  }, [isAuthenticated.current, session]);

  // if page is reloaded and still in session, get new current ttl for session
  // the useeffect below must be place after the first

  useEffect(() => {
    const getActiveSession = async () => {
      if (!isInitialized.current && session && initialRenderComplete) {
        isInitialized.current = true;
        try {
          const {
            data: { id, ttl, sessionId, refreshToken },
          } = await mutateAsyncResumeSession();
          updateData({ ttl, sessionId, refreshToken, userId: id });
          startTokenRefreshTimer({
            refreshToken,
            expirationTime: ttl,
            mutateRefreshToken: mutateAsync,
          });
        } catch (error) {
          isInitialized.current = true;
          stopTokenRefreshTimer();
        }
      }
    };

    getActiveSession();
  }, [isInitialized.current, session, initialRenderComplete]);

  return null;
}
