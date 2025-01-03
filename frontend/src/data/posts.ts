import { Post, PostCategorySelect } from "@/types/post";

export const posts: Post[] = [
  {
    id: 1,
    author: {
      id: 1,
      email: "manbil1718@gmail.com",
      name: "Muhammad Nabil",
    },
    title: "My First Programming Post",
    slug: "my-first-programming-post",
    preview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    image: {
      id: 1,
      name: "margaret",
      alt: "kurwa",
      file_name: "kurwa",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1280px-Cat_August_2010-4.jpg",
    },
    content: "Sample Content",
    status: "published",
    tags: ["next-js", "programming"],
    updated_at: "2024-08-08",
  },
  {
    id: 2,
    author: {
      id: 2,
      email: "cucibaju123@gmail.com",
      name: "Revaldo Pratama Putra Bijaksana",
    },
    title: "My Second Programming Post",
    slug: "my-second-programming-post",
    preview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    image: {
      id: 2,
      name: "margaret",
      alt: "kurwa",
      file_name: "kurwa",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Gustav_chocolate.jpg/800px-Gustav_chocolate.jpg",
    },
    content: "Sample Content",
    status: "draft",
    tags: ["algorithm", "go", "programming"],
    updated_at: "2024-08-08",
  },
  {
    id: 3,
    author: {
      id: 3,
      email: "cucibaju123@gmail.com",
      name: "Jury Pratama Putra Bijaksana",
    },
    title: "My Third Programming Post",
    slug: "my-third-programming-post",
    preview:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    image: {
      id: 2,
      name: "margaret",
      alt: "kurwa",
      file_name: "kurwa",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/1280px-Felis_catus-cat_on_snow.jpg",
    },
    content: "Sample Content",
    status: "archived",
    tags: ["algorithm", "go", "programming", "node-js", "react-js"],
    updated_at: "2024-08-08",
  },
];

export const dummyPostCategorySelect: PostCategorySelect[] = [
  {
    value: "all",
    label: "All (5)",
  },
  {
    value: "draft",
    label: "Draft (7)",
  },
  {
    value: "published",
    label: "Published (10)",
  },
  {
    value: "archived",
    label: "Archived (0)",
  },
];
