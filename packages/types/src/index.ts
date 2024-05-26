export type RefreshTokenRedisObj = {
  token: string;
  expires: Date;
  userId: string;
};

export interface SessionData {
  refreshToken: string;
  ttl: number | undefined;
  sessionId: string;
  userId: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}
