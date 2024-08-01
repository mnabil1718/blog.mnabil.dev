import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col justify-center items-center p-4 border-b">
        {children}
      </main>
      <Toaster />
      <Footer />
    </>
  );
}
