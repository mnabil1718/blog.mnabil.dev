import { CsrfTokenProvider } from "@/components/CsrfContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShowFlashMessage from "@/components/ShowFlashMessage";
import { Toaster } from "@/components/ui/toaster";
import { headers } from "next/headers";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";

  return (
    <CsrfTokenProvider csrfToken={csrfToken}>
      <Header />
      <main className="relative flex min-h-screen flex-col justify-center items-center p-4 border-b">
        {children}
      </main>
      <Toaster />
      <Footer />
    </CsrfTokenProvider>
  );
}
