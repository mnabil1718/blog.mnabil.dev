import { CsrfError, createCsrfProtect } from "@edge-csrf/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./actions/auth";
import { constructUrl } from "./utils/construct-url";
import { cookies } from "next/headers";
import { generateSetFlashMessageHeader } from "./utils/flash";

const csrfProtect = createCsrfProtect({
  cookie: {
    secure: process.env.NODE_ENV === "production",
  },
});

const anonymousRoutes = [
  "/login",
  "/signup",
  "/activation",
  "/resend-activation",
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // csrf protection
  try {
    await csrfProtect(request, response);
  } catch (err) {
    if (err instanceof CsrfError)
      return new NextResponse("invalid csrf token", { status: 403 });
    throw err;
  }

  // auth protection
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/panel")
  ) {
    const session = await getSession();
    const intendedRoute =
      request.nextUrl.pathname === "/login" ? "" : request.nextUrl.pathname;

    // NO TOKEN
    if (session.authentication_token.token == "") {
      const flashHeader = generateSetFlashMessageHeader(
        "error",
        "Please log in to your account first"
      );
      return NextResponse.redirect(
        new URL(
          constructUrl("/login", { next: intendedRoute }),
          request.nextUrl.origin
        ).href,
        {
          headers: {
            "Set-Cookie": flashHeader,
          },
        }
      );
    }
  }

  // anonymous protection
  if (
    anonymousRoutes.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const session = await getSession();
    if (session.authentication_token.token != "") {
      const flashHeader = generateSetFlashMessageHeader(
        "error",
        "you are already authenticated."
      );

      return NextResponse.redirect(
        new URL("/dashboard", request.nextUrl.origin).href,
        {
          headers: {
            "Set-Cookie": flashHeader,
          },
        }
      );
    }
  }
  return response;
}
