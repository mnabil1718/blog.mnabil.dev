"use client";
import React, { useRef } from "react";
import { Form } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { postSchema, PostSchemaType } from "@/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFormHeader from "./PostFormHeader";
import PostEditorForm from "./PostEditorForm";
import PostMetadataForm from "./PostMetadataForm";

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
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          // h-screen minus navbar height
          className="min-h-[calc(100vh-64px)] flex flex-col"
        >
          <PostFormHeader />
          <div className="relative flex-1 xl:flex">
            <div className="relative mx-auto max-w-screen-sm p-5">
              <PostEditorForm />
            </div>
            <div className="hidden xl:block w-[420px] p-5 h-auto flex-none border-l border-border bg-background space-y-3">
              <div>
                <PostMetadataForm />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default AddPostForm;
