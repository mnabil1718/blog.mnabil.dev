import React from "react";
import Link from "@/components/Link";
import CardContentPreview from "@/components/CardContentPreview";
import Image, { StaticImageData } from "next/image";

type Post = {
  imageSrc?: StaticImageData;
};

const PostCard = ({ imageSrc }: Post) => {
  return (
    <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <Link href="#" className="col-span-1">
        <div className="relative overflow-hidden">
          <Image
            src={imageSrc ?? ""}
            alt={`thumbnail`}
            width={1200}
            height={630}
            className="aspect-video rounded-md object-cover"
          />
        </div>
      </Link>
      <div className="cols-span-1 lg:col-span-2">
        <CardContentPreview />
      </div>
    </article>
  );
};

export default PostCard;
