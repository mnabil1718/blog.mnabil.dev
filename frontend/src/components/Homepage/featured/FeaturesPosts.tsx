import React from "react";
import FirstPost from "./FirstPost";
import SecondPost from "./SecondPost";
import ThirdPost from "./ThirdPost";

const FeaturesPosts = () => {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 text-center">
        Featured
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2 gap-3">
        <FirstPost />
        <SecondPost />
        <ThirdPost />
        <ThirdPost />
      </div>
    </section>
  );
};

export default FeaturesPosts;
