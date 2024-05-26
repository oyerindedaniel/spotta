import { z } from "zod";

const areaSchema = z.object({
  name: z.string(),
  state: z.string().trim().min(1, { message: "Can’t be empty" }),
  lga: z.string().trim().min(1, { message: "Can’t be empty" }),
  coordinates: z.object({
    longitude: z.number().optional(),
    latitude: z.number().optional(),
    address: z.string().optional(),
  }),
  medias: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(3, { message: "Please upload at least three image" }),
});

const createAreaSchema = areaSchema.extend({});

const updateAreaSchema = areaSchema.extend({
  id: z.string(),
  deletedMedias: z.array(z.object({ id: z.string(), src: z.string() })),
});

export { createAreaSchema, updateAreaSchema };
