import AuthLayout from "@/layouts/AuthLayout";
import ResendActivationForm from "@/components/auth/ResendActivationForm";
import { protectAnonymousPage } from "@/actions/auth";
import { headers } from "next/headers";

export default async function ResendActivationPage() {
  await protectAnonymousPage();
  const csrfToken = headers().get("X-CSRF-Token") || "missing";

  return (
    <AuthLayout>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm rounded-md border border-border px-8 py-10 bg-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Resend Activation
          </h1>
          <p className="text-sm text-muted-foreground">
            To resend activation token, please enter your registered email
            address.
          </p>
        </div>

        <ResendActivationForm csrfToken={csrfToken} />
      </div>
    </AuthLayout>
  );
}
