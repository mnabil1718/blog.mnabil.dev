import { CsrfTokenProvider } from "@/components/CsrfContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import React from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";

  return (
    <CsrfTokenProvider csrfToken={csrfToken}>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-4 border-b">
        {/* Taking the space of navbar */}
        <div className="h-[70px]"></div>
        {children}
      </main>
      <Toaster />
      <Footer />
    </CsrfTokenProvider>
  );
}
