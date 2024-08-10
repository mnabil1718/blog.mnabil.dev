export type Author = {
  id: number;
  name: string;
  email: string;
};

// we will always deal with author on the frontend
// thats why author is included as part of post
export type Post = {
  id: number;
  author: Author;
  title: string;
  slug: string;
  preview: string;
  content: string;
  image_url: string;
  status: "draft" | "published" | "archived";
  tags: string[];
  updated_at: string;
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// TODO: zod schema for forms

export type PostCategorySelect = {
  value: string;
  label: string;
};
