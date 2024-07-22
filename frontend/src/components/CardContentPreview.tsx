import React from "react";
import Link from "@/components/Link";
import { Badge } from "./ui/badge";
import Tag from "./Tag";

interface CardContentPreviwProps {
  isOnBackground?: boolean;
  withTitle?: boolean;
  withTags?: boolean;
  withSummary?: boolean;
  withPublishedOn?: boolean;
}

const sampleTags: string[] = ["Next Js", "Go", "Programming", "Data structure"];

const CardContentPreview = ({
  isOnBackground = false,
  withTitle = true,
  withTags = true,
  withSummary = true,
  withPublishedOn = true,
}: CardContentPreviwProps) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        {withTitle && (
          <h2 className="text-2xl font-bold leading-8 tracking-tight">
            <Link
              href="#"
              className={isOnBackground ? `text-background` : `text-foreground`}
            >
              My First Programming Post
            </Link>
          </h2>
        )}
        {withTags && (
          <div className="flex flex-wrap gap-1">
            {sampleTags.map((tag, idx) => {
              return (
                <Tag key={idx} text={tag} isOnBackground={isOnBackground} />
              );
            })}
          </div>
        )}
      </div>
      {withSummary && (
        <div
          className={`prose prose-sm max-w-none ${
            isOnBackground ? `text-background` : `text-foreground`
          }`}
        >
          Short summary of the post containing outline and keywords of the post.
          Keep it. I hope this text doesn&apos;t overflow to the right. Because
          if it does, my layout is kinda messed up. I HATE frontend so much.
        </div>
      )}
      {withPublishedOn && (
        <div>
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd
              className={`flex gap-1 text-sm font-semibold leading-6 ${
                isOnBackground ? `text-background` : `text-foreground`
              }`}
            >
              <span>1,234 views</span>
              <span>・</span>
              <time dateTime="2024-07-06">2024-07-06</time>
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default CardContentPreview;
