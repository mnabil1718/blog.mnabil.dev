import FeaturesPosts from "@/components/Homepage/featured/FeaturesPosts";
import LatestPosts from "@/components/Homepage/Lastest/LatestPosts";

export default function Home() {
  return (
    <div className="mx-auto w-full xl:max-w-screen-xl">
      <FeaturesPosts />
      <LatestPosts />
    </div>
  );
}
