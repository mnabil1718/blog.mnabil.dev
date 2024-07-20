"use client";

import React from "react";
import Editor from "@/components/editor";
import PublicLayout from "@/layouts/PublicLayout";
import FeaturedPosts from "@/components/homepage/featured/FeaturedPosts";

export default function EditorPage() {
  return (
    <PublicLayout>
      <FeaturedPosts />
      <div className="relative w-full">
        <Editor />
      </div>
    </PublicLayout>
  );
}
