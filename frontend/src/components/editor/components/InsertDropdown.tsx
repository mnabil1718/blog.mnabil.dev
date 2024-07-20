/* eslint-disable jsx-a11y/alt-text */
"use client";

import React, { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Image } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InsertImageDialog } from "../plugins/ImagesPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function InsertDropdown() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button variant="outline">
              <span className="mr-4">Insert</span>{" "}
              <ChevronDown className="text-slate-500" size={14} />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Image className="mr-2" size={16} />
              <span>Image</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image Upload</DialogTitle>
          <DialogDescription>
            Dialog for uploading image into rich text editor, whether through
            URL or file upload
          </DialogDescription>
        </DialogHeader>
        <InsertImageDialog activeEditor={activeEditor} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
