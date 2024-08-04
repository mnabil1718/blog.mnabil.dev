"use server";

import { signUpSchemaType } from "@/validations/signup";
import axios from "axios";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const testHealthCheck = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/healthcheck`,
      {
        cache: "no-store",
        credentials: "include",
        headers: {
          Cookies: cookies().toString(),
        },
      }
    );
    console.log(response);
    if (!response.ok) {
      console.log("NOT OK", response);
      return null;
    } else {
      const data = await response.json();
      console.log("MASOK", data);
    }
  } catch (error) {
    console.log("ERROR", error);
    return null;
  }
};

export async function signupAction(data: signUpSchemaType) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": data.csrf_token,
          "Set-Cookie": `csrf_token=${data.csrf_token}; Path=/; HttpOnly; Secure`,
        },
      }
    );

    console.log("RES", response);
  } catch (error) {
    console.log("ERROR", error);
    return {
      error: "Something unexpected happens",
    };
  }
}
