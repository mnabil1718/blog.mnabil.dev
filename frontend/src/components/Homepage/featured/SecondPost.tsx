import Image from "next/image";
import React from "react";
import Post2 from "../../../../public/images/post-2.jpg";
import CardContentPreview from "../../CardContentPreview";

const SecondPost = () => {
  return (
    <div className="col-span-1 xl:row-span-2 h-96 md:h-auto rounded-lg relative overflow-hidden">
      <div className="absolute z-10 bottom-4 left-4">
        <CardContentPreview isOnBackground withSummary={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      <Image
        src={Post2}
        alt={`thumbnail`}
        width={1200}
        height={630}
        className="aspect-video h-full w-full rounded-md object-cover"
      />
    </div>
  );
};

export default SecondPost;
