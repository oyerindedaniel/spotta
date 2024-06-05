import { User } from "@prisma/client";

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

export type UserSession = User | null;
export type UserDTOBase = Pick<
  User,
  "id" | "firstName" | "lastName" | "picture"
>;
export type UserDTOWithContact = UserDTOBase & Pick<User, "email" | "phone">;
export type UserDTO = UserDTOBase | UserDTOWithContact | null;

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
