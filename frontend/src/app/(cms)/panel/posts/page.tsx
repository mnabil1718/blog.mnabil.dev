import { getSession } from "@/actions/auth";
import PostListHeader from "@/components/cms/post/PostListHeader";
import ListPanelPostsLayout from "@/layouts/ListPanelPostsLayout";
import { Post, PostStatusCount } from "@/types/post";
import axios, { isAxiosError } from "axios";
import { notFound } from "next/navigation";

import React from "react";

async function getData(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<Post[]> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`,
      {
        params: searchParams,
      }
    );

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

export default async function PanelPostsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const posts = await getData(searchParams);
  const postStatusCount = await getCountByStatus();

  return (
    <div className="mx-auto w-full p-5 max-w-screen-lg space-y-5">
      <PostListHeader postStatusCount={postStatusCount} />
      <ListPanelPostsLayout posts={posts} />
    </div>
  );
}
