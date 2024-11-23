import AddPostForm from "@/components/cms/post/AddPostForm";
import { CsrfTokenProvider } from "@/components/CsrfContext";
import CmsLayout from "@/layouts/CmsLayout";
import { headers } from "next/headers";

export default async function PanelPostsAddPage() {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";
  return (
    <CsrfTokenProvider csrfToken={csrfToken}>
      <CmsLayout>
        <AddPostForm />
      </CmsLayout>
    </CsrfTokenProvider>
  );
}
