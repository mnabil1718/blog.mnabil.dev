import React from "react";
import PostListHeaderSkeleton from "./PostListHeaderSkeleton";
import ListPanelPostsLayoutSkeleton from "./ListPanelPostsLayoutSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const PanelPostsPageSkeleton = () => {
  return (
    <div className="mx-auto w-full p-5 max-w-screen-lg space-y-5">
      <PostListHeaderSkeleton />
      <ListPanelPostsLayoutSkeleton />
      <div className="flex items-center justify-center gap-4">
        <Skeleton className="w-20 h-9 bg-slate-200" />
        <Skeleton className="w-9 h-9 bg-slate-200" />
        <Skeleton className="w-20 h-9 bg-slate-200" />
      </div>
    </div>
  );
};

export default PanelPostsPageSkeleton;
