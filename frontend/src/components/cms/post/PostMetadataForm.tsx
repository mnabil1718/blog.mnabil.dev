import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostSchemaType } from "@/validations/post";
import React from "react";
import { useFormContext } from "react-hook-form";

const PostMetadataForm = () => {
  const form = useFormContext<PostSchemaType>();
  return (
    <>
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input
                type="text"
                autoComplete="name"
                placeholder="e.g. next-js"
                {...field}
                className={
                  form.formState.errors.slug
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
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <Input
                type="file"
                autoComplete="image_url"
                {...field}
                className={
                  form.formState.errors.image_url
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
