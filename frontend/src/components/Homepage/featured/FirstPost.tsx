import Image from "next/image";
import React from "react";
import Post1 from "../../../../public/images/post-1.jpg";
import CardContentPreview from "@/components/CardContentPreview";

const FirstPost = () => {
  return (
    <div className="col-span-1 relative overflow-hidden xl:col-span-2 h-96 rounded-lg">
      <div className="absolute z-10 bottom-4 left-4 space-y-3">
        <CardContentPreview isOnBackground withSummary={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      <Image
        src={Post1}
        alt={`thumbnail`}
        width={1200}
        height={630}
        className="h-full w-full rounded-md object-cover"
      />
    </div>
  );
};

export default FirstPost;
