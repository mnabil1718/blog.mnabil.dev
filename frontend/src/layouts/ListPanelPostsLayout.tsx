import React from "react";
import { Post } from "@/types/post";
import PostListTile from "@/components/cms/post/PostListTile";
import NoData from "@/components/NoData";

const ListPanelPostsLayout = ({ posts }: { posts: Post[] }) => {
  return (
    <ul className="space-y-3">
      {posts.length > 0 ? (
        posts.map((post) => {
          return (
            <li key={post.id}>
              <PostListTile post={post} />
            </li>
          );
        })
      ) : (
        <div className="min-h-[450px] flex flex-col justify-center items-center">
          <NoData />
        </div>
      )}
    </ul>
  );
};

export default ListPanelPostsLayout;
