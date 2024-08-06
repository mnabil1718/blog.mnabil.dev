import Header from "@/components/cms/Header";
import Sidebar from "@/components/cms/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { SessionData } from "@/lib/session";
import { IronSession } from "iron-session";
import React from "react";

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
      <Toaster />
    </div>
  );
}
