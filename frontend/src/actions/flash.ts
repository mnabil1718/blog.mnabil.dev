"use server";

import { cookies } from "next/headers";

// most use cases only require this function
// to be invoked by server action. So no formData required
export async function setFlashMessage(
  type: "error" | "success",
  message: string
) {
  const cookieStore = cookies();
  cookieStore.set("flash_message", JSON.stringify({ type, message }), {
    httpOnly: true,
    secure: process.env.NODE_ENV == "development" ? false : true,
    path: "/",
    maxAge: 60, // Optional, in seconds
  });
}

// csrf middleware require csrfToken
// why use csrf? server action uses POST under the hood
export async function getFlashMessage(formData: FormData) {
  const cookieStore = cookies();
  const flashMessage = cookieStore.get("flash_message");

  if (flashMessage) {
    cookieStore.delete("flash_message");
    return JSON.parse(flashMessage.value);
  }

  return null;
}
