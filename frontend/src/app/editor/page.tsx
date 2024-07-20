"use client";

import React from "react";
import Editor from "@/components/editor";
import PublicLayout from "@/layouts/PublicLayout";

export default function EditorPage() {
  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-screen-sm">
        <Editor />
      </div>
    </PublicLayout>
  );
}
