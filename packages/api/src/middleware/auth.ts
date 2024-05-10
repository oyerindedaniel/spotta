import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { db } from "@repo/db";

import { ACCESS_TOKEN_SECRET } from "../config";

type TokenPayload = Pick<User, "id">;

async function verifyToken({
  accessToken,
  sessionId,
}: {
  accessToken: string;
  sessionId: string;
}): Promise<{ user: User & { sessionId: string } } | null> {
  try {
    const decoded = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET,
    ) as TokenPayload;

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
        sessions: { some: { id: sessionId, invalidatedAt: null } },
      },
    });

    if (user) {
      return { user: { ...user, sessionId } };
    }
    return null;
  } catch (error) {
    console.log("Error verifying token");
    return null;
  }
}

export { verifyToken };
