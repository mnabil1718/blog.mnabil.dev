import CheckURLSearchParams from "@/components/CheckURLSearchParams";
import PostListHeader from "@/components/cms/post/PostListHeader";
import { dummyPostCategorySelect, posts } from "@/data/posts";
import CmsLayout from "@/layouts/CmsLayout";
import ListPanelPostsLayout from "@/layouts/ListPanelPostsLayout";
import { Post, PostCategorySelect } from "@/types/post";

import React from "react";

async function getData(): Promise<Post[]> {
  // TODO: fetch User's posts
  return posts;
}

async function getCategories(): Promise<PostCategorySelect[]> {
  // TODO: fetch post's categories and their count
  return dummyPostCategorySelect;
}

export default async function PanelPostsPage() {
  const posts = await getData();
  const postCategories = await getCategories();
  return (
    <CmsLayout>
      <div className="mx-auto w-full p-5 max-w-screen-lg space-y-5">
        <CheckURLSearchParams />
        <PostListHeader postCategories={postCategories} />
        <ListPanelPostsLayout posts={posts} />
        <ListPanelPostsLayout posts={posts} />
        <ListPanelPostsLayout posts={posts} />
        <ListPanelPostsLayout posts={posts} />
      </div>
    </CmsLayout>
  );
}
