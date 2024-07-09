import React from "react";
import PageHeading from "@/components/PageHeading";
import PostGridItem from "@/components/homepage/featured/PostGridItem";
import Post1 from "../../../../public/images/post-1.jpg";
import Post2 from "../../../../public/images/post-2.jpg";
import Post3 from "../../../../public/images/post-3.jpg";
import Post4 from "../../../../public/images/post-4.jpg";

const FeaturedPosts = () => {
  return (
    <section>
      <PageHeading headerText="Featured" isTextCentered />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2 gap-3">
        <PostGridItem img={Post1} className="col-span-1  xl:col-span-2 h-96 " />
        <PostGridItem
          img={Post2}
          className="col-span-1 xl:row-span-2 h-96 md:h-auto"
          imgClassName="aspect-video"
        />
        <PostGridItem img={Post3} className="col-span-1 h-96" />
        <PostGridItem img={Post4} className="col-span-1 h-96" />
      </div>
    </section>
  );
};

export default FeaturedPosts;
