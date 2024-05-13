import { Session, User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { db } from "@repo/db";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config";

type TokenPayload = Pick<User, "id"> & { sessionId: string };

async function verifyToken(
  accessToken: string,
): Promise<{ user: User & { sessionId: string } } | null> {
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"],
    }) as TokenPayload;

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
        sessions: { some: { id: decoded.sessionId, invalidatedAt: null } },
      },
    });

    if (user) {
      return { user: { ...user, sessionId: decoded.sessionId } };
    }
    return null;
  } catch (error) {
    console.log("Error verifying token");
    return null;
  }
}

type RefreshTokenPayload = Pick<Session, "id">;

async function verifyRefreshToken(token: string): Promise<Session | null> {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      algorithms: ["HS256"],
    }) as RefreshTokenPayload;

    const session = await db.session.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (session) {
      return session;
    }
    return null;
  } catch (error) {
    console.log("Error verifying token");
    return null;
  }
}

export { verifyRefreshToken, verifyToken };
