import FeaturedPosts from "@/components/homepage/featured/FeaturedPosts";
import LatestPosts from "@/components/homepage/Latest/LatestPosts";
import PublicLayout from "@/layouts/PublicLayout";

export default function Home() {
  return (
    <PublicLayout>
      <div className="mx-auto w-full xl:max-w-screen-xl">
        <FeaturedPosts />
        <LatestPosts />
      </div>
    </PublicLayout>
  );
}
