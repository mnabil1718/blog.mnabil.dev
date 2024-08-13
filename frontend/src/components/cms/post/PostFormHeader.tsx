import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostSchemaType } from "@/validations/post";
import { Save, Send } from "lucide-react";
import React from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { MobileSidePanel } from "./MobileSidePanel";

const PostFormHeader = () => {
  const form = useFormContext<PostSchemaType>();
  return (
    <div className="relative p-5 w-full flex items-start gap-3 border-b border-border bg-background/80 saturate-100 backdrop-blur-[10px]">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormControl>
              <Input
                type="text"
                autoComplete="title"
                placeholder="Enter Post Title..."
                {...field}
                className={
                  form.formState.errors.title
                    ? "border border-destructive focus-visible:ring-destructive"
                    : "border border-border"
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button variant={"outline"} className="flex items-center gap-2">
        <Save size={14} /> <span className="hidden md:block">Save</span>
      </Button>
      <Button className="flex items-center gap-2">
        <Send size={14} /> <span className="hidden md:block">Publish</span>
      </Button>
      <div className="block xl:!hidden">
        <MobileSidePanel />
      </div>
    </div>
  );
};

export default PostFormHeader;
