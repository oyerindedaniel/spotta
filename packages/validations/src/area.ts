import { z } from "zod";

const createAreaSchema = z.object({
  name: z.string(),
  state: z.string().trim().min(1, { message: "Can’t be empty" }),
  lga: z.string().trim().min(1, { message: "Can’t be empty" }),
  coordinates: z
    .object({
      longitude: z.number().optional(),
      latitude: z.number().optional(),
      address: z.string().optional(),
    })
    .optional(),
  medias: z.union([
    z
      .array(z.instanceof(File))
      .min(3, { message: "Please upload at least three image" }),
    z.array(z.string().url()),
  ]),
});

export { createAreaSchema };
