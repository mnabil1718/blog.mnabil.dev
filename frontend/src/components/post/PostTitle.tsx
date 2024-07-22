import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  extraComponent?: React.ReactNode;
  headerText?: string;
  isTextCentered?: boolean;
};

const PostTitle = ({
  headerText = "",
  extraComponent,
  isTextCentered = false,
}: Props) => {
  return (
    <h1
      className={cn(
        isTextCentered && "text-center",
        "text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-5xl md:leading-14"
      )}
    >
      {headerText}
    </h1>
  );
};

export default PostTitle;
