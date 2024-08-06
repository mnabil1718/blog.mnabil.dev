import { z } from "zod";

export const resendActivationSchema = z.object({
  email: z.string().email(),
});

export type ResendActivationSchemaType = z.infer<typeof resendActivationSchema>;
