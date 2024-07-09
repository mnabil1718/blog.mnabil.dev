import PostCard from "@/components/post/PostCard";
import Post1 from "../../public/images/post-1.jpg";
import Post2 from "../../public/images/post-2.jpg";
import Post3 from "../../public/images/post-3.jpg";
import React from "react";

const ListLayout = () => {
  return (
    <ul>
      <li className="py-4">
        <PostCard imageSrc={Post1} />
      </li>
      <li className="py-4">
        <PostCard imageSrc={Post2} />
      </li>
      <li className="py-4">
        <PostCard imageSrc={Post3} />
      </li>
    </ul>
  );
};

export default ListLayout;
