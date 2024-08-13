"use client";

import { DashboardNav } from "@/components/cms/DashboardNav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/constants/data";
import { PostSchemaType } from "@/validations/post";
import { MenuIcon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import PostMetadataForm from "./PostMetadataForm";

// import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  form: UseFormReturn<PostSchemaType>;
}

export function MobileSidePanel() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="cursor-pointer">
          <Button variant={"outline"}>
            <SettingsIcon size={16} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="!px-0 h-screen overflow-y-auto vertical-scroll"
        >
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Metadata
              </h2>
              <div className="space-y-1">
                <PostMetadataForm />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
