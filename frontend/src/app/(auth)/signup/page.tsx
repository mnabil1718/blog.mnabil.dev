import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="h-[70px]"></div>
      <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6 max-w-sm rounded-md border border-border px-8 py-10 bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Create your new account
          </p>
        </div>

        <SignUpForm />

        <span className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Already have an account? Login
          </Link>
        </span>
      </div>
    </AuthLayout>
  );
}
