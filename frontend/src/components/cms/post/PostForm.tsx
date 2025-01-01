"use client";
import React, { useRef } from "react";
import { Form } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { postSchema, PostSchemaType } from "@/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFormHeader from "./PostFormHeader";
import PostEditorForm from "./PostEditorForm";
import PostMetadataForm from "./PostMetadataForm";
import objectToFormData from "@/utils/object-to-form-data";
import { useCsrfToken } from "@/components/CsrfContext";
import { updatePostAction } from "@/actions/post";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";
import { useToast } from "@/components/ui/use-toast";
import { POST_ACTION, POST_STATUS } from "@/constants/post";
import { Post } from "@/types/post";

const PostForm = ({ initData }: { initData: Post }) => {
  const { toast } = useToast();
  const csrfToken = useCsrfToken();
  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    mode: "onSubmit",
    defaultValues: {
      title: initData.title ?? "",
      slug: initData.slug ?? "",
      preview: initData.preview ?? "",
      content: initData.content ?? "",
      image: {
        name: initData.image?.name ?? "",
        alt: initData.image?.alt ?? "",
        url: initData.image?.url ?? "",
      },
      tags: initData.tags ?? [],
    },
  });

  const onSubmit = form.handleSubmit(async (data, event) => {
    const action = (
      (event?.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    )?.value as string;

    var status: string = "";

    if (action === POST_ACTION.SAVE) {
      status = POST_STATUS.DRAFT;
    }

    if (action === POST_ACTION.PUBLISH) {
      status = POST_STATUS.PUBLISHED;
    }

    if (status === "") {
      showErrorToast(toast, "Cannot read post action");
    }

    const formData = objectToFormData({
      title: data.title,
      slug: data.slug,
      preview: data.preview,
      tags: data.tags,
      content: data.content,
      image_name: data.image.name,
      image_alt: data.image.alt,
      status: status,
      csrf_token: csrfToken,
    });

    const updatePostWithID = updatePostAction.bind(null, initData.id);
    const response = await updatePostWithID(formData);

    if (response?.error) {
      if (typeof response.error === "string") {
        showErrorToast(toast, response.error);
      }

      if (typeof response.error === "object") {
        for (const [key, message] of Object.entries(response.error)) {
          form.setError(key as keyof PostSchemaType, {
            type: "manual",
            message: message as string,
          });
          showErrorToast(toast, message as string);
        }
      }
      return;
    }

    showSuccessToast(toast, `Post ${action} successfully`);
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          // h-screen minus navbar height
          className="min-h-[calc(100vh-64px)] flex flex-col"
        >
          <PostFormHeader />
          <div className="relative flex-1 xl:flex bg-slate-100">
            <div className="mx-auto max-w-screen-sm p-3">
              <PostEditorForm />
            </div>
            <div className="hidden xl:block w-[420px] p-5 h-auto flex-none border-l border-border bg-background space-y-3">
              <div className="space-y-4">
                <PostMetadataForm />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default PostForm;
