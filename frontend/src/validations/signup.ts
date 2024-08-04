import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    password: z.string().min(6, "password must be longer than 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type signUpSchemaType = z.infer<typeof signUpSchema>;
