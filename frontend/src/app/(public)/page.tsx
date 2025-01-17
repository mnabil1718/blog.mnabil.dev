import FeaturedPosts from "@/components/homepage/featured/FeaturedPosts";
import LatestPosts from "@/components/homepage/Latest/LatestPosts";

export default function Home() {
  return (
    <div className="mx-auto w-full xl:max-w-screen-xl">
      <FeaturedPosts />
      <LatestPosts />
    </div>
  );
}
