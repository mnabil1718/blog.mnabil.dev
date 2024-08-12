"use client";
import React, { useRef } from "react";
import Editor from "@/components/editor/editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { postSchema, PostSchemaType } from "@/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFormHeader from "./PostFormHeader";
import PostEditorForm from "./PostEditorForm";
import { SettingsIcon } from "lucide-react";

const AddPostForm = () => {
  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      slug: "",
      preview: "",
      content: "",
      image_url: "",
      tags: [],
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {});

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        // h-screen minus navbar height
        className="min-h-[calc(100vh-64px)] flex flex-col"
      >
        <PostFormHeader form={form} />
        <div className="relative flex-1 xl:flex">
          <div className="relative mx-auto max-w-screen-sm p-5">
            <PostEditorForm form={form} />
          </div>
          <div className="hidden xl:block w-[420px] p-5 h-auto flex-none border-l border-border bg-background space-y-3">
            <div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input type="text" id="slug" />
              </div>
              <div>
                <Label htmlFor="image">Thumbnail</Label>
                <Input type="file" id="image" placeholder="e.g. next-js; go" />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input type="text" id="tags" placeholder="e.g. next-js; go" />
              </div>
              <div>
                <Label htmlFor="preview">Summary</Label>
                <Textarea
                  placeholder="Enter your post's summary"
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddPostForm;
