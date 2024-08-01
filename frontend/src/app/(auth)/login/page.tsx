"use client";

import Link from "next/link";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const urlQueryParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (urlQueryParams.has("activationSuccess")) {
      toast({
        title: "Success!",
        description: "Activation Successful. Please login to your account.",
      });
    }
  }, [toast, urlQueryParams]);

  return (
    <AuthLayout>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm rounded-md border border-border px-8 py-10 bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email & password to sign in to your account
          </p>
        </div>

        <LoginForm />

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
