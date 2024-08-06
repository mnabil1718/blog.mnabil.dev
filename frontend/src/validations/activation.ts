import { z } from "zod";

export const activationSchema = z.object({
  token: z.string().min(1).max(200),
});

export type ActivationSchemaType = z.infer<typeof activationSchema>;
