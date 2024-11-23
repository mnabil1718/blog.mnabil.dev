"use server";

import axios, { isAxiosError } from "axios";
import { getSession } from "./auth";

export async function uploadImageAction(formData: FormData) {
  var errorDetails: string = "";
  try {
    const session = await getSession();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorDetail = error.response?.data.error;
      errorDetails = errorDetail;
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }

    return {
      error: errorDetails,
    };
  }
}
