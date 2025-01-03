import { AppSidebar } from "@/components/cms/AppSidebar";
import Header from "@/components/cms/Header";
import { CsrfTokenProvider } from "@/components/CsrfContext";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="relative min-h-screen">
            <Header />
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </CsrfTokenProvider>
  );
}
