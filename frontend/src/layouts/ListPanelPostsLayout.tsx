import React from "react";
import { Post } from "@/types/post";
import PostListTile from "@/components/cms/post/PostListTile";

const ListPanelPostsLayout = ({ posts }: { posts: Post[] }) => {
  return (
    <ul className="space-y-3">
      {posts.map((post) => {
        return (
          <li key={post.id}>
            <PostListTile post={post} />
          </li>
        );
      })}
    </ul>
  );
};

export default ListPanelPostsLayout;
