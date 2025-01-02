import PageHeading from "@/components/PageHeading";
import React from "react";

import { Search } from "lucide-react";
import ListLayout from "@/layouts/ListLayout";
import Tag from "@/components/Tag";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PublicLayout from "@/layouts/PublicLayout";

export default function Blog() {
  return (
    <div className="mx-auto w-full xl:max-w-screen-sm">
      <div className="divide-y divide-muted-background">
        <PageHeading
          headerText="All Posts"
          extraComponent={
            <div className="relative w-full">
              <label>
                <span className="sr-only">Search articles</span>
                <input
                  aria-label="Search articles"
                  type="text"
                  placeholder="Search articles"
                  className="block w-full rounded-md border border-muted-foreground bg-secondary px-4 py-2 text-muted-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary dark:border-muted"
                />
              </label>
              <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            </div>
          }
        />
        <div className="pt-4">
          <Carousel className="md:mx-12">
            <CarouselContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem key={index} className="pl-1 basis-auto">
                  <div className="p-1">
                    <Tag text="Next Js" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <ListLayout />
        </div>
      </div>
    </div>
  );
}
