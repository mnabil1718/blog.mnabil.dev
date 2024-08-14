import Dropzone from "@/components/Dropzone";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from "@/constants/file";
import { cn } from "@/lib/utils";
import { slugify } from "@/utils/slug";
import { PostSchemaType } from "@/validations/post";
import { FileCheck2Icon, RotateCcwIcon } from "lucide-react";
import React, { MouseEvent, useState } from "react";
import { useFormContext } from "react-hook-form";

const PostMetadataForm = () => {
  const form = useFormContext<PostSchemaType>();

  const handleGenerateSlugOnClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    form.setFocus("slug");
    form.setValue("slug", "");
    const title = form.getValues("title") as string;
    if (title === "" || title == undefined) {
      form.setError(
        "slug",
        { type: "manual", message: "title is empty" },
        { shouldFocus: true }
      );
      return;
    }
    form.setValue("slug", slugify(title));
  };

  function handleOnDrop(acceptedFiles: FileList | null) {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Check file type
      if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
        form.setValue("image_url", null);
        form.setError("image_url", {
          message: "File type is not valid",
          type: "typeError",
        });
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        form.setValue("image_url", null);
        form.setError("image_url", {
          message: "Max image size is 5MB.",
          type: "typeError",
        });
        return;
      }

      form.setValue("image_url", file);
      form.clearErrors("image_url");
    } else {
      form.setValue("image_url", null);
      form.setError("image_url", {
        message: "File is required",
        type: "typeError",
      });
    }
  }

  return (
    <>
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"ghost"}
                        type="button"
                        className="absolute right-0"
                        onClick={handleGenerateSlugOnClick}
                      >
                        <RotateCcwIcon size={14} />{" "}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden lg:block bg-foreground text-xs text-background">
                      Generate from title
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. next-js"
                  {...field}
                  className={cn(
                    "pr-11",
                    form.formState.errors.slug
                      ? "border border-destructive focus-visible:ring-destructive"
                      : "border border-border"
                  )}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <Dropzone
                {...field}
                multiple={false}
                accept=".jpg,.jpeg,.png,.webp"
                dropMessage={
                  form.watch("image_url")
                    ? form.watch("image_url")?.name
                    : "Drop files or click here"
                }
                handleOnDrop={handleOnDrop}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Input
                type="text"
                autoComplete="tags"
                placeholder="e.g. next-js; tailwindcss"
                {...field}
                className={
                  form.formState.errors.tags
                    ? "border border-destructive focus-visible:ring-destructive"
                    : "border border-border"
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preview"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <Textarea
                rows={5}
                placeholder="Enter post summary or preview short text..."
                {...field}
                className={
                  form.formState.errors.preview
                    ? "border border-destructive focus-visible:ring-destructive"
                    : "border border-border"
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PostMetadataForm;
