import React from "react";
import { ArrowUpRight } from "lucide-react";

import Link from "@/components/Link";

import Post1 from "../../../../public/images/post-1.jpg";
import Post2 from "../../../../public/images/post-2.jpg";
import Post3 from "../../../../public/images/post-3.jpg";
import { Button } from "@/components/ui/button";

import PostCard from "@/components/post/PostCard";

const LatestPosts = () => {
  return (
    <section className="pt-10 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Latest
        </h1>
        <Button
          variant={"outline"}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <Link href="#" className=" flex justify-center items-center gap-2">
            See all
            <ArrowUpRight strokeWidth={1} />
          </Link>
        </Button>
      </div>
      <ul className="space-y-4">
        <li>
          <PostCard imageSrc={Post1} />
        </li>
        <li>
          <PostCard imageSrc={Post2} />
        </li>
        <li>
          <PostCard imageSrc={Post3} />
        </li>
      </ul>
    </section>
  );
};

export default LatestPosts;
