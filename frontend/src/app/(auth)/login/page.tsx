import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { headers } from "next/headers";
import CheckURLSearchParams from "@/components/CheckURLSearchParams";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";
  const nextUrl: string = Array.isArray(searchParams?.next)
    ? searchParams?.next[0]
    : searchParams?.next || "/dashboard";

  return (
    <AuthLayout>
      <CheckURLSearchParams />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm rounded-md border border-border px-8 py-10 bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email & password to sign in to your account
          </p>
        </div>

        <LoginForm csrfToken={csrfToken} nextUrl={nextUrl} />

        <span className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
