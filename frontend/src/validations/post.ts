import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/constants/file";
import { isValidSlug, slugify } from "@/utils/slug";
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(1, "title is required").max(200, "title is too long"),
  slug: z
    .string()
    .min(1, "slug is required")
    .refine((val) => isValidSlug(val), {
      message: "invalid slug",
    }),
  preview: z
    .string()
    .min(1, "summary is required")
    .max(500, "summary must be less than 500 characters"),
  content: z.string().min(1, "content is required"),
  image_url: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  tags: z
    .array(z.string())
    .min(1, "at least 1 tag is required")
    .max(5, "no more than 5 tags are allowed")
    .refine((tags) => new Set(tags).size === tags.length, {
      message: "tags must be unique",
    }),
});

export type PostSchemaType = z.infer<typeof postSchema>;
