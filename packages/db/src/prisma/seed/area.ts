import { prisma } from "./";

interface SeedAreaParams {
  userId: string;
}

async function areas({ userId }: SeedAreaParams) {
  // Define the areas to be seeded
  const areaData = [
    {
      slug: "central-park",
      name: "Central Park",
      state: "New York",
      lga: "Manhattan",
      address: "New York, NY 10024, USA",
      longitude: -73.9712,
      latitude: 40.7831,
      createdById: userId,
      medias: [
        {
          src: "https://utfs.io/f/992549a3-2d86-4a1b-9135-ff743db42c72-qz6c6s.jpg",
        },
        {
          src: "https://utfs.io/f/74c3e9ef-0749-48f6-8f87-b17355bfb9a4-upk5f7.jpg",
        },
        {
          src: "https://utfs.io/f/74c3e9ef-0749-48f6-8f87-b17355bfb9a4-upk5f7.jpg",
        },
      ],
    },
    {
      slug: "golden-gate-park",
      name: "Golden Gate Park",
      state: "California",
      lga: "San Francisco",
      address: "San Francisco, CA 94122, USA",
      longitude: -122.4862,
      latitude: 37.7694,
      createdById: userId,
      medias: [
        {
          src: "https://utfs.io/f/992549a3-2d86-4a1b-9135-ff743db42c72-qz6c6s.jpg",
        },
        {
          src: "https://utfs.io/f/74c3e9ef-0749-48f6-8f87-b17355bfb9a4-upk5f7.jpg",
        },
        {
          src: "https://utfs.io/f/74c3e9ef-0749-48f6-8f87-b17355bfb9a4-upk5f7.jpg",
        },
      ],
    },
  ];

  const areaUpsertPromises = areaData.map((area) =>
    prisma.area.upsert({
      where: { slug: area.slug },
      update: {},
      create: {
        ...area,
        medias: {
          create: area.medias.map((media) => ({
            ...media,
            userId,
          })),
        },
      },
      include: {
        medias: true,
      },
    }),
  );

  const seededAreas = await Promise.all(areaUpsertPromises);
  return seededAreas;
}

export const seedAreas = async ({ userId }: SeedAreaParams) => {
  try {
    const seededAreas = await areas({ userId });
    console.log("Seeding areas completed 🎉🎉");
    return seededAreas;
  } catch (err) {
    console.log("Seeding areas failed ❌❌", err);
    throw err;
  }
};
