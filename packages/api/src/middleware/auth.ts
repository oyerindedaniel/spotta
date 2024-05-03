import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { db } from "@repo/db";

import { ACCESS_TOKEN_SECRET } from "../config";

type TokenPayload = Pick<User, "id">;

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    const user = await db.user.findUnique({
      where: { id: decoded.id },
    });
    if (user) {
      return { id: user.id };
    }
    return null;
  } catch (error) {
    // console.error("Error verifying token:", error);
    return null;
  }
}

export { verifyToken };
