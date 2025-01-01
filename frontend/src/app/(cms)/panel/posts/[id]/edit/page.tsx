import { getSession } from "@/actions/auth";
import PostForm from "@/components/cms/post/PostForm";
import { Post } from "@/types/post";
import axios, { isAxiosError } from "axios";
import { notFound } from "next/navigation";
import React from "react";

async function getPostByID(id: number) {
  const session = await getSession();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token.token}`,
        },
      }
    );

    return res.data.post;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    throw new Error("Failed to fetch data");
  }
}

export default async function EditPostPage({
  params,
}: {
  params: { id: number };
}) {
  const post: Post = await getPostByID(params.id);
  return <PostForm initData={post} />;
}
