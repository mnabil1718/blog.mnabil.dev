"use client";
import React, { useState } from "react";
import { DashboardNav } from "@/components/cms/DashboardNav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import Link from "next/link";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <>
      {/* This Idea of having relative counterpart to trick other element
     that this fixed element is initially relative, so it takes a "real space" */}
      <aside
        className={cn(
          `fixed z-10 h-full hidden flex-none border-r bg-card transition-[width] duration-500 md:block`,
          !isMinimized ? "w-72" : "w-[72px]",
          className
        )}
      >
        <div className="overflow-x-hidden hidden p-5 pt-10 lg:block">
          <Link href={"/"}>
            <span className="w-fit h-4 text-primary-foreground bg-primary rounded-lg px-2 py-1 font-bold">
              {!isMinimized ? "blog.mnabil.dev" : "/"}
            </span>
          </Link>
        </div>
        <div
          className={cn(
            "absolute -right-4 top-5 z-50 cursor-pointer rounded-full border p-1 bg-background text-foreground",
            isMinimized && "rotate-180"
          )}
          onClick={handleToggle}
        >
          <ChevronLeft size={24} />
        </div>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="mt-3 space-y-1">
              <DashboardNav items={navItems} />
            </div>
          </div>
        </div>
      </aside>
      <div
        className={cn(
          "relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block",
          !isMinimized ? "w-72" : "w-[72px]"
        )}
      ></div>
    </>
  );
}
