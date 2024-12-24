"use server";

import { DefaultSession, SessionData, sessionOptions } from "@/lib/session";
import axios, { isAxiosError } from "axios";
import { getIronSession, IronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setFlashMessage } from "./flash";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.authentication_token) {
    session.authentication_token = DefaultSession.authentication_token;
    session.user = DefaultSession.user;
  }

  return session;
}

// do not use in middleware
export async function setSession(data: SessionData) {
  const session = await getSession();
  session.authentication_token = data.authentication_token;
  session.user = data.user;
  await session.save();
}

// Do not use in middleware
export async function revokeSession() {
  const session = await getSession();
  await session.destroy();
}

export async function loginAction(formData: FormData) {
  const nextUrl = formData.get("nextUrl") as string;

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

    await setSession({
      authentication_token: res.data.authentication_token,
      user: res.data.user,
    });
  } catch (error) {
    let details = "Failed to submit data";
    if (isAxiosError(error)) {
      if (error.code == "ECONNREFUSED") {
        details = "Something unexpected happens. Please check your connection";
      } else {
        const errorDetail = error.response?.data.error;
        if (typeof error.response?.data.error === "object") {
          details = "Invalid authentication credentials";
        } else {
          details = errorDetail;
        }
      }
    } else if (error instanceof Error) {
      details = error.message;
    }

    return {
      error: details,
    };
  }

  revalidatePath("/login");

  // Redirect have internal error handling and should be called after try-catch block
  // more info: https://nextjs.org/docs/14/app/api-reference/functions/redirect
  redirect(nextUrl);
}

// do not delete formData since it is used by csrf_token middleware
export async function logoutAction(formData: FormData) {
  var errorDetails: string = "";
  try {
    const session = await getSession();
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/authentication`,
      {
        headers: {
          Authorization: `Bearer ${session.authentication_token.token}`,
        },
      }
    );
    session.destroy();
  } catch (error) {
    let details = "Failed to submit data";
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

  setFlashMessage("success", "Successfully logged out");
  redirect("/login");
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

  revalidatePath("/activation");
  setFlashMessage(
    "success",
    "Activation successful. Please log in to your account"
  );
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
}
