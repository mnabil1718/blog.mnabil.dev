import React from "react";
import CardContentPreview from "@/components/CardContentPreview";
import Post3 from "../../../../public/images/post-3.jpg";
import Image from "next/image";

const ThirdPost = () => {
  return (
    <div className="col-span-1 h-96 rounded-lg relative overflow-hidden">
      <div className="absolute z-10 bottom-4 left-4">
        <CardContentPreview isOnBackground withSummary={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      <Image
        src={Post3}
        alt={`thumbnail`}
        width={1200}
        height={630}
        className="h-full w-fit rounded-md object-cover"
      />
    </div>
  );
};

export default ThirdPost;
