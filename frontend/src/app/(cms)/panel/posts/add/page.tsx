import Editor from "@/components/editor/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CmsLayout from "@/layouts/CmsLayout";
import { Save, Send } from "lucide-react";
import React from "react";

export default async function PanelPostsAddPage() {
  return (
    <CmsLayout>
      <div className="xl:flex">
        <div className="relative mx-auto p-5 max-w-screen-lg">
          <div className="sticky top-[65px] z-[1] w-full flex items-center gap-3 py-5 bg-background/80 saturate-100 backdrop-blur-[10px]">
            <Input type="text" placeholder="Enter Post Title..." />
            <Button variant={"outline"} className="flex items-center gap-2">
              <Save size={14} /> Save
            </Button>
            <Button className="flex items-center gap-2">
              <Send size={14} /> Publish
            </Button>
          </div>
          <Editor />
        </div>
        <div className="hidden xl:block z-[1] top-20 w-96 p-5 flex-none border-l border-border h-screen bg-background">
          asasasa asasasaas asasasaas sasasas asasasaasasa asasas
        </div>
      </div>
    </CmsLayout>
  );
}
