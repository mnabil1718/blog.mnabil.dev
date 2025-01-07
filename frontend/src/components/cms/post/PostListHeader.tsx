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

const PostListHeader = ({
  postStatusCount,
}: {
  postStatusCount: PostStatusCount[];
}) => {
  const [category, setCategory] = useState(postStatusCount[0].status);
  const onChangeHandler = (value: string) => {
    setCategory(value);
    // TODO: Set URL Query String Filter
  };

  return (
    <div className="flex justify-between">
      <Select
        value={category}
        defaultValue={postStatusCount[0].count.toString()}
        onValueChange={onChangeHandler}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {postStatusCount.map((category, idx) => {
            return (
              <SelectItem key={idx} value={category.count.toString()}>
                {category.status}
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
