import { AmenityCategory } from "@prisma/client";

import { prisma } from "./";

type AmenitiesArgs = {
  userId: string;
  categories: Array<AmenityCategory>;
};

async function amenities({ userId, categories }: AmenitiesArgs) {
  // Seed amenities with real names
  const amenities = [
    {
      name: "Gym",
      createdById: userId,
      categoryId: categories[0]!.id,
    },
    {
      name: "Swimming Pool",
      createdById: userId,
      categoryId: categories[1]!.id,
    },
    {
      name: "Tennis Court",
      createdById: userId,
      categoryId: categories[2]!.id,
    },
    {
      name: "Playground",
      createdById: userId,
      categoryId: categories[3]!.id,
    },
    {
      name: "Conference Room",
      createdById: userId,
      categoryId: categories[4]!.id,
    },
    {
      name: "Library",
      createdById: userId,
      categoryId: categories[5]!.id,
    },
    {
      name: "Spa",
      createdById: userId,
      categoryId: categories[0]!.id,
    },
    {
      name: "Sauna",
      createdById: userId,
      categoryId: categories[1]!.id,
    },
    {
      name: "Movie Theater",
      createdById: userId,
      categoryId: categories[0]!.id,
    },
    {
      name: "Game Room",
      createdById: userId,
      categoryId: categories[2]!.id,
    },
    {
      name: "Cafeteria",
      createdById: userId,
      categoryId: categories[4]!.id,
    },
    {
      name: "Bar",
      createdById: userId,
      categoryId: categories[5]!.id,
    },
  ];

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
    return seedAmenities;
  } catch (err) {
    console.log("Seeding amenities failed 🎾🎾❌❌");
    throw err;
  }
};
