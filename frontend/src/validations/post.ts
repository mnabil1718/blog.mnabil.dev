import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "title is required").max(200, "title is too long"),
  slug: z.string().min(1, "slug is required"),
  preview: z
    .string()
    .min(1, "preview is required")
    .max(500, "preview must be less than 500 characters"),
  content: z.string().min(1, "content is required"),
  image_url: z.string().min(1, "thumbnail is required"),
  tags: z
    .array(z.string())
    .min(1, "at least 1 tag is required")
    .max(5, "no more than 5 tags are allowed")
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "tags must be unique",
    }),
});

export type PostSchemaType = z.infer<typeof postSchema>;
