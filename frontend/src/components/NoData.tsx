import React from "react";
import EmptyIllustration from "./EmptyIllustration";

const NoData = () => {
  return (
    <div className="flex flex-col w-fit text-center text-muted-foreground gap-3">
      <EmptyIllustration />
      <span>no_data</span>
    </div>
  );
};

export default NoData;
