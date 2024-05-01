import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_SECRET,
  AUTH_DURATION,
  REFRESH_TOKEN_SECRET,
} from "../config/index.js";

function generateAccessToken(userId: number): string {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: `${AUTH_DURATION}m`,
  });
}

function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: `${AUTH_DURATION}m`,
  });
}

export { generateAccessToken, generateRefreshToken };
