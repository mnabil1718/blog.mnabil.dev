"use client";

import { createPostAction } from "@/actions/post";
import { useCsrfToken } from "@/components/CsrfContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ActionResponse } from "@/types/action-response";
import objectToFormData from "@/utils/object-to-form-data";
import { showDefaultToastNoTitle, showErrorToast } from "@/utils/show-toasts";
import { LoaderCircle, Plus } from "lucide-react";
import React, { useState } from "react";

export default function CreatePostButton() {
  const csrfToken = useCsrfToken();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClickHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsLoading(true);

    showDefaultToastNoTitle(toast, "Creating post...");

    const formData = objectToFormData({
      csrf_token: csrfToken,
    });

    const response: ActionResponse = await createPostAction(formData);

    if (response?.error) {
      if (typeof response.error === "string") {
        showErrorToast(toast, response.error);
      }

      if (typeof response.error === "object") {
        for (const [key, message] of Object.entries(response.error)) {
          showErrorToast(toast, message as string);
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <Button
      className="flex items-center gap-2"
      onClick={onClickHandler}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderCircle className="animate-spin" size={16} />
      ) : (
        <Plus size={16} />
      )}{" "}
      New Post
    </Button>
  );
}
