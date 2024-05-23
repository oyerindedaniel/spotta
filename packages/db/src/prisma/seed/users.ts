import { faker } from "@faker-js/faker";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "./";

const adminDetails = {
  firstName: "daniel",
  lastName: "oyerinde",
  email: "oyerindedaniel2002@gmail.com",
  password: "Daniel12345",
} as const;

async function users() {
  // Hash passwords
  const adminPassword = await bcrypt.hash(adminDetails.password, 5);
  const userPassword = await bcrypt.hash("userpassword", 5);

  // Upsert admin user
  const admin = await prisma.user.upsert({
    where: { email: adminDetails.email },
    update: {},
    create: {
      firstName: adminDetails.firstName,
      lastName: adminDetails.lastName,
      email: adminDetails.email,
      password: adminPassword,
      role: "ADMIN",
      authService: "CREDENTIALS",
      isConfirmed: true,
      picture: faker.image.avatar(),
      phone: faker.phone.number(),
      emailVerified: new Date(),
    },
  });

  // Upsert regular user
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "user@example.com",
      password: userPassword,
      role: "USER",
      authService: "CREDENTIALS",
      isConfirmed: true,
      picture: faker.image.avatar(),
      phone: faker.phone.number(),
      emailVerified: faker.date.recent(),
    },
  });

  return { admin, user };
}

export const seedUsers = async (): Promise<{ admin: User; user: User }> => {
  try {
    const seededUsers = await users();
    console.log("Seeding users completed 🙎‍♂️🙎‍♂️🎉🎉");
    return seededUsers;
  } catch (err) {
    console.log("Seeding users failed 🙎‍♂️🙎‍♂️❌❌", err);
    throw err;
  }
};
