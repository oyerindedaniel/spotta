import { PrismaClient } from "@prisma/client";

import { seedAmenities } from "./amenities";
import { seedAreas } from "./area";
import { seedCategories } from "./category";
import { seedUsers } from "./users";

// $ npx prisma db seed

export const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");
  const { admin } = await seedUsers();

  console.log("Seeding category...");
  const categories = await seedCategories({ userId: admin.id });

  console.log("Seeding amenities...");
  await seedAmenities({ userId: admin.id, categories });

  console.log("Seeding areas...");
  await seedAreas({ userId: admin.id });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding completed. 🎉🎉🎉🎉🎉🎊🎊🎊🎊");
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
