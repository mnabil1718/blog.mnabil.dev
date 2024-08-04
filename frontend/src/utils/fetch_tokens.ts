"use server";

import { cookies } from "next/headers";

export async function getCsrfToken(): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/csrf`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return "";
    } else {
      const { token } = await response.json();
      return token;
    }
  } catch (error) {
    console.log(error);
    return "";
  }
}
