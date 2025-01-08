import Image from "next/image";
import React from "react";
import SVG from "../../public/images/not-found.svg";

const EmptyIllustration = () => {
  return (
    <Image
      src={SVG}
      width={100}
      alt="empty illustration"
      className="opacity-100"
    />
  );
};

export default EmptyIllustration;
