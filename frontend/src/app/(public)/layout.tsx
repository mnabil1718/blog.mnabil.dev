import ShowFlashMessage from "@/components/ShowFlashMessage";
import PublicLayout from "@/layouts/PublicLayout";

export default function PublicPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicLayout>
      <ShowFlashMessage />
      {children}
    </PublicLayout>
  );
}
