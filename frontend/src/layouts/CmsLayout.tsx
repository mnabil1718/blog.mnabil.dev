import Header from "@/components/cms/Header";
import Sidebar from "@/components/cms/Sidebar";
import { CsrfTokenProvider } from "@/components/CsrfContext";
import ShowFlashMessage from "@/components/ShowFlashMessage";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import React from "react";

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";

  return (
    <CsrfTokenProvider csrfToken={csrfToken}>
      <div className="flex">
        <Sidebar />
        <main className="relative w-full">
          <Header />
          {children}
        </main>
        <Toaster />
      </div>
    </CsrfTokenProvider>
  );
}
