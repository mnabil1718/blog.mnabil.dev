"use server";

import { DefaultSession, SessionData, sessionOptions } from "@/lib/session";
import { constructUrl } from "@/utils/construct-url";
import { encodeQueryParams } from "@/utils/encode-query-params";
import axios, { isAxiosError } from "axios";
import { getIronSession, IronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.authentication_token) {
    session.authentication_token = DefaultSession.authentication_token;
    session.user = DefaultSession.user;
  }

  return session;
}

export async function setSession(data: SessionData) {
  const session = await getSession();
  session.authentication_token = data.authentication_token;
  session.user = data.user;
  await session.save();
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
  redirect(nextUrl); // for some bloody reason, cannot be used in a try catch block
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
    if (isAxiosError(error)) {
      const errorDetail = error.response?.data.error;
      errorDetails = errorDetail;
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }
  }

  const url = constructUrl("/login", {
    flash_type: errorDetails != "" ? "error" : "success",
    flash_message:
      errorDetails != "" ? errorDetails : "Successfully logged out",
  });
  redirect(url);
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
  const flash = encodeQueryParams({
    flash_type: "success",
    flash_message: "Activation successful. Please log in to your account",
  });
  redirect(`/login?${flash}`);
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
