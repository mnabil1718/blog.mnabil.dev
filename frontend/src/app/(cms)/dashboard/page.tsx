import CheckURLSearchParams from "@/components/CheckURLSearchParams";
import CmsLayout from "@/layouts/CmsLayout";

export default function DashboardPage() {
  return (
    <CmsLayout>
      <div className="mx-auto w-full xl:max-w-screen-xl">
        <CheckURLSearchParams />
      </div>
    </CmsLayout>
  );
}
