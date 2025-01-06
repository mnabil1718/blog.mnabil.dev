"use client";
import React, { useRef, useTransition } from "react";
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
import { useRouter } from "next/navigation";

const PostForm = ({ initData }: { initData: Post }) => {
  const { toast } = useToast();
  const csrfToken = useCsrfToken();
  const router = useRouter();
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
      status: initData.status ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data, event) => {
    const action = (
      (event?.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    )?.value as string;

    var status: string = "";

    if (action === POST_ACTION.SAVE) {
      status = initData.status ?? POST_STATUS.DRAFT;
    }

    if (action === POST_ACTION.PUBLISH) {
      status = POST_STATUS.PUBLISHED;
    }

    var formData: FormData = objectToFormData({
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

    if (action === POST_ACTION.UNPUBLISH) {
      status = POST_STATUS.DRAFT;
      formData = objectToFormData({
        status: status,
        csrf_token: csrfToken,
      });
    }

    if (status === "") {
      showErrorToast(toast, "Cannot read post action");
      return;
    }

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

    // reset form default values to newly updated post
    form.reset(response.post);

    showSuccessToast(toast, `Post ${action} successfully`);

    router.refresh();
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          id="post-form"
          onSubmit={onSubmit}
          className="bg-slate-100 p-3 space-y-2"
        >
          <PostFormHeader />
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-2">
            <div className="col-span-4 rounded-md overflow-hidden border">
              <PostEditorForm />
            </div>

            <div className="hidden xl:block col-span-2 overflow-hidden rounded-md border">
              <div className="h-[calc(100vh-180px)] p-5 overflow-y-auto soft-scroll bg-white">
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
