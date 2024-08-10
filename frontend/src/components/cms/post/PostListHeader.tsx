"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import PostListTile from "@/components/cms/post/PostListTile";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCategorySelect } from "@/types/post";

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

      <Button className="flex items-center gap-2">
        <Plus size={16} /> New Post
      </Button>
    </div>
  );
};

export default PostListHeader;
