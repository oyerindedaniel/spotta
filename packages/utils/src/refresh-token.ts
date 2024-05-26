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

//TODO: implement queue to take refresh token errors

export const startTokenRefreshTimer = ({
  expirationTime,
  refreshToken,
  mutateRefreshToken: mutateAsync,
}: RefreshTokenProps) => {
  const updateData = useSessionStore.getState().updateData;
  const clearData = useSessionStore.getState().clearData;
  const expirationMinus120000 = Number(expirationTime) - 120000; // subtract 2 minute
  const jwtExpirationTime =
    expirationMinus120000 < 0 ? 1000 : expirationMinus120000;

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
      clearData();
      stopTokenRefreshTimer();
    }
  }, jwtExpirationTime);
};
