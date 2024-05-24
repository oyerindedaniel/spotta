import { type Prisma, type PrismaClient } from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import slugify from "slugify";

import { db } from "@repo/db";

const generateRandomString = (length: number) => {
  const randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < Number(length); i += 1) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );
  }
  return result;
};

const generateRandomNumber = (length: number) => {
  const randomChars = "0123456789";
  let result = "";
  for (let i = 0; i < Number(length); i += 1) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length),
    );
  }
  return result;
};

export async function generateUniqueSlug(
  name: string,
  isUnique: (slug: string) => Promise<boolean>,
): Promise<string> {
  const baseSlug = slugify(name, { lower: true });
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await isUnique(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export { generateRandomNumber, generateRandomString };
