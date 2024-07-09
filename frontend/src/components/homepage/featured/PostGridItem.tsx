import React from "react";
import Image, { StaticImageData } from "next/image";
import CardContentPreview from "@/components/CardContentPreview";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  imgClassName?: string;
  img: StaticImageData;
};

const PostGridItem = ({ className, imgClassName, img }: Props) => {
  return (
    <div
      className={cn(
        className?.includes("col-span-")
          ? className
          : `col-span-1 ${className}`,
        `relative overflow-hidden rounded-lg`
      )}
    >
      <div className="absolute z-10 bottom-4 left-4 space-y-3">
        <CardContentPreview isOnBackground withSummary={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      <Image
        src={img}
        alt={`thumbnail`}
        width={1200}
        height={630}
        className={cn(imgClassName, `w-full h-full rounded-md object-cover`)}
      />
    </div>
  );
};

export default PostGridItem;
