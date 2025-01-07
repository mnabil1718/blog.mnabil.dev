import { getSession } from "@/actions/auth";
import PostListHeader from "@/components/cms/post/PostListHeader";
import ListPanelPostsLayout from "@/layouts/ListPanelPostsLayout";
import { Post, PostStatusCount } from "@/types/post";
import axios, { isAxiosError } from "axios";
import { notFound } from "next/navigation";

import React from "react";

async function getData(): Promise<Post[]> {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`);

    return res.data.posts;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    throw new Error("Failed to fetch data");
  }
}

async function getCountByStatus(): Promise<PostStatusCount[]> {
  const session = await getSession();

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/status/count`,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token.token}`,
        },
      }
    );

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    throw new Error("Failed to fetch data");
  }
}

export default async function PanelPostsPage() {
  const posts = await getData();
  const postStatusCount = await getCountByStatus();

  console.log(postStatusCount);
  return (
    <div className="mx-auto w-full p-5 max-w-screen-lg space-y-5">
      {/* <PostListHeader postStatusCount={postStatusCount} /> */}
      <ListPanelPostsLayout posts={posts} />
    </div>
  );
}
