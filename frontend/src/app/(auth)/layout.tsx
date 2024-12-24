import ShowFlashMessage from "@/components/ShowFlashMessage";
import AuthLayout from "@/layouts/AuthLayout";

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      <ShowFlashMessage />
      {children}
    </AuthLayout>
  );
}
