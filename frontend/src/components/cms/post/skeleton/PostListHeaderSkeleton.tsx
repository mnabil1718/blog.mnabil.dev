import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PostListHeaderSkeleton = () => {
  return (
    <div className="flex justify-between">
      <Skeleton className="w-[180px] h-10 rounded-md" />
      <Skeleton className="w-32 h-10 rounded-md bg-slate-200" />
    </div>
  );
};

export default PostListHeaderSkeleton;
