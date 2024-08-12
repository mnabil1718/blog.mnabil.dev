import AddPostForm from "@/components/cms/post/AddPostForm";
import CmsLayout from "@/layouts/CmsLayout";

import React from "react";

export default async function PanelPostsAddPage() {
  return (
    <CmsLayout>
      <AddPostForm />
    </CmsLayout>
  );
}
