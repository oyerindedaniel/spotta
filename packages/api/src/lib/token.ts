import { Session, User } from "@prisma/client";
import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_SECRET,
  AUTH_DURATION,
  REFRESH_TOKEN_SECRET,
} from "../config";

interface AccessToken {
  user: User;
  session: Session;
}

interface RefreshToken {
  session: Session;
}

function generateAccessToken(props: AccessToken): string {
  const { user, session } = props;
  return jwt.sign({ id: user.id, sessionId: session.id }, ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: `${AUTH_DURATION}m`,
  });
}

function generateRefreshToken(props: RefreshToken): string {
  const { session } = props;
  return jwt.sign({ id: session.id }, REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
  });
}

export { generateAccessToken, generateRefreshToken };
