import Link from "next/link";
import ActivationForm from "@/components/auth/ActivationForm";

export default async function ActivationPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm rounded-md border border-border px-8 py-10 bg-white">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Activation</h1>
        <p className="text-sm text-muted-foreground">
          To activate your account, please enter the activation token from your
          email.
        </p>
      </div>

      <ActivationForm />

      <span className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/resend-activation"
          className="hover:text-brand underline underline-offset-4"
        >
          Don&apos;t receive email? Resend Activation
        </Link>
      </span>
    </div>
  );
}
