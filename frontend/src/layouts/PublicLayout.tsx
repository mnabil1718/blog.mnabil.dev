import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center py-7 px-4 border">
        {/* Taking the space of navbar */}
        <div className="h-[70px]"></div>
        {children}
      </main>
      <Footer />
    </>
  );
}
