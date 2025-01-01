"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCategorySelect } from "@/types/post";
import CreatePostButton from "./CreatePostButton";

const PostListHeader = ({
  postCategories,
}: {
  postCategories: PostCategorySelect[];
}) => {
  const [category, setCategory] = useState(postCategories[0].value);
  const onChangeHandler = (value: string) => {
    setCategory(value);
    // TODO: Set URL Query String Filter
  };

  return (
    <div className="flex justify-between">
      <Select
        value={category}
        defaultValue={postCategories[0].value}
        onValueChange={onChangeHandler}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {postCategories.map((category, idx) => {
            return (
              <SelectItem key={idx} value={category.value}>
                {category.label}
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
