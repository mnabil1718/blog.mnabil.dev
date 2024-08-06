"use server";

import { DefaultSession, SessionData, sessionOptions } from "@/lib/session";
import { loginSchemaType } from "@/validations/login";
import { signUpSchemaType } from "@/validations/signup";
import axios, { isAxiosError } from "axios";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.authentication_token) {
    session.authentication_token = DefaultSession.authentication_token;
    session.user = DefaultSession.user;
  }

  return session;
}

export async function protectAuthPage() {
  const session = await getSession();
  if (
    !session.authentication_token ||
    session.authentication_token == "" ||
    session.user.activated == false
  ) {
    redirect("/login");
  }
}

export async function protectAnonymousPage() {
  const session = await getSession();
  if (session.authentication_token && session.authentication_token != "") {
    redirect("/dashboard");
  }
}

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/authentication`,
      {
        email: email,
        password: password,
      }
    );
    const session = await getSession();
    session.authentication_token = res.data.authentication_token.token;
    session.user = res.data.user;
    await session.save();
  } catch (error) {
    let details = "Failed to submit data";
    if (isAxiosError(error)) {
      const errorDetail = error.response?.data.error;
      if (typeof error.response?.data.error === "object") {
        details = "invalid authentication credentials";
      } else {
        details = errorDetail;
      }
    } else if (error instanceof Error) {
      details = error.message;
    }

    return {
      error: details,
    };
  }

  revalidatePath("/login");
  redirect("/dashboard"); // for some bloody reason, cannot be used in a try catch block
}

// do not delete formData since it is used by csrf_token middleware
export async function logoutAction(formData: FormData) {
  var hasError = false;
  try {
    const session = await getSession();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/authentication`,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token}`,
        },
      }
    );

    session.authentication_token = DefaultSession.authentication_token;
    session.user = DefaultSession.user;
    await session.save();
  } catch (error) {
    hasError = true;
  }

  redirect("/login"); // for some bloody reason, cannot be used in a try catch block
}

export async function signupAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      name: name,
      email: email,
      password: password,
    });
    return {
      message:
        "We've sent an activation link to your email. Please check your email to activate your account.",
    };
  } catch (error) {
    let details = "Failed to submit data";
    if (isAxiosError(error)) {
      details = error.response?.data.error;
    } else if (error instanceof Error) {
      details = error.message;
    }

    return {
      error: details,
    };
  }
}

export async function activationAction(formData: FormData) {
  try {
    const token = formData.get("token") as string;
    await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/activation`, {
      token: token,
    });
  } catch (error) {
    let details = "Failed to submit data";
    if (isAxiosError(error)) {
      details = error.response?.data.error;
    } else if (error instanceof Error) {
      details = error.message;
    }

    return {
      error: details,
    };
  }

  revalidatePath("/activation");
  redirect("/login");
}

export async function resendActivationAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/activation`,
      {
        email: email,
      }
    );
    return {
      message:
        "We've re-sent the activation link to your email. Please check your email",
    };
  } catch (error) {
    let details = "Failed to submit data";
    if (isAxiosError(error)) {
      details = error.response?.data.error;
    } else if (error instanceof Error) {
      details = error.message;
    }

    return {
      error: details,
    };
  }
}
