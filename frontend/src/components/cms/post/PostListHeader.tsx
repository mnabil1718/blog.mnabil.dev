"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostStatusCount } from "@/types/post";
import CreatePostButton from "./CreatePostButton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PostListHeader = ({
  postStatusCount,
}: {
  postStatusCount: PostStatusCount[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the status from the URL query parameters, if available
  const statusFromURL = searchParams.get("status");

  // Initialize the category based on the status in the URL, or default to the first status from the list
  const defaultCategory =
    postStatusCount.find((item) => item.status === statusFromURL)?.status ||
    postStatusCount[0].status;
  const [category, setCategory] = useState(defaultCategory);

  const onChangeHandler = (newCategory: string) => {
    setCategory(newCategory);

    const updatedParams = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      updatedParams.set("status", newCategory);
    } else {
      updatedParams.delete("status");
    }

    const queryString = updatedParams.toString()
      ? `?${updatedParams.toString()}`
      : "";

    router.push(`${pathname}${queryString}`);
  };

  return (
    <div className="flex justify-between">
      <Select
        value={category}
        defaultValue={postStatusCount[0].status}
        onValueChange={onChangeHandler}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="all" />
        </SelectTrigger>
        <SelectContent>
          {postStatusCount.map((category, idx) => {
            return (
              <SelectItem key={idx} value={category.status}>
                {category.status} ({category.count})
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <CreatePostButton />
    </div>
  );
};

export default PostListHeader;
