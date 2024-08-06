import { getSession, protectAuthPage } from "@/actions/auth";
import CmsLayout from "@/layouts/CmsLayout";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  await protectAuthPage();
  return (
    <CmsLayout>
      <div className="mx-auto w-full xl:max-w-screen-xl"></div>
    </CmsLayout>
  );
}
