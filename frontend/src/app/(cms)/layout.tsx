import ShowFlashMessage from "@/components/ShowFlashMessage";
import CmsLayout from "@/layouts/CmsLayout";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <CmsLayout>
      <ShowFlashMessage />
      {children}
    </CmsLayout>
  );
}
