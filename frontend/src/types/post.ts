// we will always deal with author on the frontend

import { Image } from "./image";
import { User } from "./user";

export type Post = {
  id: number;
  author?: User;
  title?: string;
  slug?: string;
  preview?: string;
  content?: string;
  image?: Image;
  status: "draft" | "published" | "archived";
  tags: string[];
  updated_at?: string; // time
  created_at?: string;
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// TODO: zod schema for forms

export type PostCategorySelect = {
  value: string;
  label: string;
};
