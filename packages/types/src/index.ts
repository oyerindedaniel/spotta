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

export type reactionProps = {
  isLiked: boolean;
  isDisliked: boolean;
  onToggleLike: (action: "LIKE" | "UNLIKE") => void;
  onToggleDislike: (action: "DISLIKE" | "UNDISLIKE") => void;
};
