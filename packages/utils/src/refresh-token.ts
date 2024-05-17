import { useSessionStore } from "@repo/hooks/src/use-session-store";

type RefreshTokenProps = {
  expirationTime: number;
  refreshToken: string;
  mutateRefreshToken: any;
};

let refreshTimer: NodeJS.Timeout | null = null;

export const stopTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

export const startTokenRefreshTimer = ({
  expirationTime,
  refreshToken,
  mutateRefreshToken: mutateAsync,
}: RefreshTokenProps) => {
  const updateData = useSessionStore.getState().updateData;
  const jwtExpirationTime = Number(expirationTime) - 60000; // subtract 1 minute

  refreshTimer = setTimeout(async () => {
    try {
      const {
        data: { refreshToken: newRefreshToken, ttl: newExpirationTime },
      } = await mutateAsync({
        refreshToken,
      });
      updateData({
        ttl: newExpirationTime,
        refreshToken: newRefreshToken,
      });
      startTokenRefreshTimer({
        expirationTime: newExpirationTime,
        refreshToken: newRefreshToken,
        mutateRefreshToken: mutateAsync,
      });
    } catch (error) {
      console.error(error);
      updateData({ ttl: undefined, sessionId: "", refreshToken: "" });
      stopTokenRefreshTimer();
    }
  }, jwtExpirationTime);
};
