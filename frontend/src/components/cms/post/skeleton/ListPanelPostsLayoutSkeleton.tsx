import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ListPanelPostsLayoutSkeleton = () => {
  return (
    <ul className="space-y-3">
      {Array.from([1, 2, 3]).map((idx) => {
        return (
          <div
            key={idx}
            className="p-4 rounded-lg border border-slate-100 flex gap-4"
          >
            <Skeleton className="relative w-36 aspect-square lg:w-56 lg:aspect-video bg-slate-200 rounded-lg overflow-hidden flex-none"></Skeleton>
            <div className="flex-1 space-y-3">
              <Skeleton className="w-full h-6 rounded-md bg-slate-200 mb-4" />
              <div className="space-y-3 mb-4">
                {Array.from([1, 2]).map((idx) => {
                  return <Skeleton key={idx} className="w-full h-3"></Skeleton>;
                })}
              </div>
              <dl className="flex flex-wrap justify-between gap-1 text-xs">
                <dd className="flex items-center flex-wrap gap-2">
                  <Skeleton className="w-12 h-2 rounded-full" />
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-12 h-2 rounded-full" />
                </dd>
              </dl>
            </div>
          </div>
        );
      })}
    </ul>
  );
};

export default ListPanelPostsLayoutSkeleton;
