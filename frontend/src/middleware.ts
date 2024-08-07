import { CsrfError, createCsrfProtect } from "@edge-csrf/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./actions/auth";
import { encodeQueryParams } from "./utils/encode-query-params";
import { constructUrl } from "./utils/construct-url";

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
      return NextResponse.redirect(
        new URL(
          constructUrl("/login", {
            flash_type: "error",
            flash_message: "Please log in to your account first",
            next: intendedRoute,
          }),
          request.nextUrl.origin
        ).href
      );
    } else {
      // HAS TOKEN
      const now = Date.now();
      const expiryTime = new Date(
        session.authentication_token.expiry_time
      ).getTime();
      if (expiryTime < now) {
        // BUT EXPIRES
        session.destroy();
        return NextResponse.redirect(
          new URL(
            constructUrl("/login", {
              flash_type: "error",
              flash_message: "Session expired. Please log in to your account",
              next: intendedRoute,
            }),
            request.nextUrl.origin
          ).href
        );
      }
    }
  }

  // anonymous protection
  if (
    anonymousRoutes.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const session = await getSession();
    if (session.authentication_token.token != "") {
      return NextResponse.redirect(
        new URL(
          constructUrl("/dashboard", {
            flash_type: "error",
            flash_message: "You are already authenticated",
          }),
          request.nextUrl.origin
        ).href
      );
    }
  }
  return response;
}
