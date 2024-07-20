"use client";

import React from "react";
import Editor from "@/components/editor";
import PublicLayout from "@/layouts/PublicLayout";

export default function EditorPage() {
  return (
    <PublicLayout>
      <div className="relative w-full">
        <Editor showTableOfContents={true} />
      </div>
    </PublicLayout>
  );
}
