import { z } from "zod";

export const oauthSchema = z.object({
  code: z.string(),
});
