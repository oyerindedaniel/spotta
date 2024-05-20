import { z } from "zod";

const createAreaSchema = z.object({
  name: z.string(),
  state: z.string(),
  lga: z.string(),
  address: z.string(),
  longitude: z.string(),
  latitude: z.string(),
  medias: z.array(z.string().url()),
});

export { createAreaSchema };
