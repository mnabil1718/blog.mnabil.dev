"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
          className="h-screen overflow-y-auto soft-scroll"
          side={"right"}
        >
          <SheetHeader>
            <SheetTitle>Post Metadata</SheetTitle>
            <SheetDescription>
              Specify your post&apos;s metadata
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-1 py-4">
            <PostMetadataForm />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button">Done</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
