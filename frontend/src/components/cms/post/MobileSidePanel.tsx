"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import PostMetadataForm from "./PostMetadataForm";

export function MobileSidePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="cursor-pointer">
          <Button variant={"outline"}>
            <SettingsIcon size={16} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="!px-2 h-screen overflow-y-auto soft-scroll"
        >
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 text-lg font-semibold tracking-tight">
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
