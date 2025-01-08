import { Image as ImageType } from "@/types/image";
import Image from "next/image";
import React from "react";

const Thumbnail = ({ image }: { image?: ImageType }) => {
  const url = !!!image?.url ? "#" : image.url;
  return (
    <div className="relative w-36 aspect-square lg:w-56 lg:aspect-video bg-gray-400 rounded-lg overflow-hidden flex-none">
      <Image
        src={`${url}?h=200`}
        alt={image?.alt ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={`${url}?=50&blur=4`}
        className="w-full object-cover"
      />
    </div>
  );
};

export default Thumbnail;
