import { AmenityCategory } from "@prisma/client";

import { prisma } from "./";

type AmenitiesArgs = {
  userId: string;
  categories: Array<AmenityCategory>;
};

const getRandomCategoryId = (categories: Array<AmenityCategory>): string => {
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex]!.id;
};

async function amenities({ userId, categories }: AmenitiesArgs) {
  // Seed amenities with real names
  const amenityNames = [
    "Gym",
    "Swimming Pool",
    "Tennis Court",
    "Playground",
    "Conference Room",
    "Library",
    "Spa",
    "Sauna",
    "Movie Theater",
    "Game Room",
    "Cafeteria",
    "Bar",
  ];

  const amenities = amenityNames.map((name) => ({
    name,
    createdById: userId,
    categoryId: getRandomCategoryId(categories),
  }));

  const upsertPromises = amenities.map((amenity) =>
    prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    }),
  );

  const seededAmenities = await Promise.all(upsertPromises);
  return seededAmenities;
}

export const seedAmenities = async ({ userId, categories }: AmenitiesArgs) => {
  try {
    const seededAmenities = await amenities({ userId, categories });
    console.log("Seeding amenities completed 🎾🎾🎉🎉");
    return seededAmenities;
  } catch (err) {
    console.log("Seeding amenities failed 🎾🎾❌❌");
    throw err;
  }
};
