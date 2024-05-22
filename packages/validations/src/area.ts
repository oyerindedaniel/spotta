import { z } from "zod";

const createAreaSchema = z.object({
  name: z.string(),
  state: z.string(),
  lga: z.string(),
  coordinates: z.object({
    longitude: z.number(),
    latitude: z.number(),
    address: z.string(),
  }),
  medias: z.union([
    z
      .array(z.instanceof(File))
      .min(3, { message: "Please upload at least three image" }),
    z.array(z.string().url()),
  ]),
});

export { createAreaSchema };
