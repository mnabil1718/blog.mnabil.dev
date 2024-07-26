import PublicLayout from "@/layouts/PublicLayout";
import Image from "next/image";
import React from "react";
import PostThumb from "../../../../public/images/post-thumb.jpg";
import PostTitle from "@/components/post/PostTitle";
import Tag from "@/components/Tag";
import { Dot } from "lucide-react";
import dynamic from "next/dynamic";

// have to be imported using dynamic imports
const EditorReadOnly = dynamic(() => import("@/components/editor/read-only"), {
  ssr: false,
});

const sampleTags: string[] = ["Next Js", "Go", "Programming"];
const author = "Muhammad Nabil";

export default function ShowPost({ params }: { params: { slug: string } }) {
  return (
    <PublicLayout>
      <section className="max-w-screen-sm mx-auto space-y-7 mb-7">
        <div className="flex flex-wrap gap-1">
          {sampleTags.map((tag, idx) => {
            return <Tag key={idx} text={tag} />;
          })}
        </div>

        <PostTitle headerText="Understanding Buffer Overflow And Stack Management Using C" />

        <p className="text-sm">
          Short summary of the post containing outline and keywords of the post.
          Keep it. I hope this text doesn&apos;t overflow to the right. Because
          if it does, my layout is kinda messed up. I HATE frontend so much.
        </p>

        <Image
          src={PostThumb}
          alt="Post Thumbnail"
          placeholder="blur"
          className="w-full aspect-video rounded-md"
        />
        <div>
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="flex items-center flex-wrap gap-1 text-sm">
              <span>Written By {author}</span>
              <span>
                <Dot size={14} />
              </span>
              <time dateTime="2024-07-06">2024-07-06</time>
            </dd>
          </dl>
        </div>
      </section>
      <EditorReadOnly showTableOfContents />
    </PublicLayout>
  );
}
