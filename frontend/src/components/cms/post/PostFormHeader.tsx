import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostSchemaType } from "@/validations/post";
import { LoaderCircle, Save, Send } from "lucide-react";
import React from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { MobileSidePanel } from "./MobileSidePanel";
import { POST_ACTION } from "@/constants/post";

const PostFormHeader = () => {
  const form = useFormContext<PostSchemaType>();

  return (
    <div className="relative p-5 w-full flex items-start gap-3 bg-background rounded-md border">
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

      {/* SAVE */}
      <Button
        type="submit"
        name="action"
        value={POST_ACTION.SAVE}
        variant={"outline"}
        className="flex items-center gap-2"
        disabled={form.formState.isSubmitting}
      >
        <Save size={14} />
        <span className="hidden md:block">Save</span>
      </Button>

      {/* PUBLISH */}
      <Button
        type="submit"
        name="action"
        value={POST_ACTION.PUBLISH}
        className="flex items-center gap-2"
        disabled={form.formState.isSubmitting}
      >
        <Send size={14} />
        <span className="hidden md:block">Publish</span>
      </Button>

      <div className="block xl:!hidden">
        <MobileSidePanel />
      </div>
    </div>
  );
};

export default PostFormHeader;
