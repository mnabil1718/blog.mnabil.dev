import React from "react";

type Props = {
  extraComponent?: React.ReactNode;
  headerText?: string;
  isTextCentered?: boolean;
};

const PageHeading = ({
  headerText = "",
  extraComponent,
  isTextCentered = false,
}: Props) => {
  return (
    <div className="space-y-2 py-8 md:space-y-5">
      <h1
        className={`${
          isTextCentered && `text-center`
        } text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-6xl md:leading-14`}
      >
        {headerText}
      </h1>
      {extraComponent}
    </div>
  );
};

export default PageHeading;
