import { createCsrfMiddleware } from "@edge-csrf/nextjs";

// initalize csrf protection middleware
const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === "production",
  },
});

export const middleware = csrfMiddleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
