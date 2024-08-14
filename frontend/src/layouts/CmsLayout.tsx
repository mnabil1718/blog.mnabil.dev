import Header from "@/components/cms/Header";
import Sidebar from "@/components/cms/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="relative w-full flex-1">
        <Header />
        {children}
      </main>
      <Toaster />
    </div>
  );
}
