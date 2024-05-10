import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_SECRET,
  AUTH_DURATION,
  REFRESH_TOKEN_SECRET,
} from "../config";

function generateAccessToken(user: User): string {
  return jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: `${Number(AUTH_DURATION)}m`,
  });
}

function generateRefreshToken(user: User): string {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: `${Number(AUTH_DURATION)}m`,
  });
}

export { generateAccessToken, generateRefreshToken };
