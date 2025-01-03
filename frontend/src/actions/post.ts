"use server";

import axios, { isAxiosError } from "axios";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setFlashMessage } from "./flash";

export async function updatePostAction(id: number, formData: FormData) {
  var errorDetails: string = "";

  try {
    const session = await getSession();

    const tags = formData.getAll("tags[]") as string[];
    const img_name = formData.get("image_name") as string;
    const img_alt = formData.get("image_alt") as string;

    const body: Record<string, any> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      preview: formData.get("preview") as string,
      content: formData.get("content") as string,
      status: formData.get("status") as string,
    };

    if (img_name && img_alt) {
      body.image = {
        name: img_name,
        alt: img_alt,
      };
    }

    if (tags.length > 0) {
      body.tags = tags;
    }

    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${id}`,
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
