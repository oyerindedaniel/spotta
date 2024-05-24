import { prisma } from "./";

async function categories({ userId }: { userId: string }) {
  // amenity categories
  const categoryNames = [
    "Health & Fitness",
    "Recreation",
    "Workspace",
    "Relaxation",
    "Entertainment",
    "Food & Drink",
  ];

  const categories = categoryNames.map((name) => ({
    name,
    createdById: userId,
  }));

  const upsertPromises = categories.map((category) =>
    prisma.amenityCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    }),
  );

  const seededCategories = await Promise.all(upsertPromises);
  return seededCategories;
}

export const seedCategories = async ({ userId }: { userId: string }) => {
  try {
    const seededCategories = await categories({ userId });
    console.log("Seeding categories completed 🏊🏊🎉🎉");
    return seededCategories;
  } catch (err) {
    console.log("Seeding categories failed 🏊🏊❌❌", err);
    throw err;
  }
};
