"use server";

import axios, { isAxiosError } from "axios";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { encodeQueryParams } from "@/utils/encode-query-params";
import { redirect } from "next/navigation";
import { setFlashMessage } from "./flash";

export async function savePostAction(formData: FormData) {
  var errorDetails: string = "";

  try {
    const session = await getSession();

    const body = {
      user_id: session.user.id,
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      preview: formData.get("preview") as string,
      content: formData.get("content") as string,
      image_name: formData.get("image_name") as string,
      image_alt: formData.get("image_alt") as string,
      status: formData.get("status") as string,
      tags: formData.getAll("tags[]") as string[],
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token.token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      errorDetails =
        error.response?.data.error ?? "Upload failed. Something went wrong";
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    return {
      error: errorDetails,
    };
  }
}

export async function createPostAction(formData: FormData) {
  var postId: number = 0;
  try {
    const session = await getSession();

    const body = {
      user_id: session.user.id,
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token.token}`,
        },
      }
    );

    postId = res.data.post.id;
  } catch (error) {
    let details = "Failed to create post";
    if (isAxiosError(error)) {
      if (error.code == "ECONNREFUSED") {
        details = "Something unexpected happens. Please check your connection";
      } else {
        details = error.response?.data.error;
      }
    } else if (error instanceof Error) {
      details = error.message;
    }

    return {
      error: details,
    };
  }

  revalidatePath("/panel/posts");
  setFlashMessage("success", "Post created successfully");
  redirect(`/panel/posts/${postId}/edit`);
}
