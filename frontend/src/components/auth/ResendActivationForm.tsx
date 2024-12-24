"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
  resendActivationSchema,
  ResendActivationSchemaType,
} from "@/validations/resend-activation";
import objectToFormData from "@/utils/object-to-form-data";
import { resendActivationAction } from "@/actions/auth";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";
import { ActionResponse } from "@/types/action-response";
import { useCsrfToken } from "../CsrfContext";

const ResendActivationForm = () => {
  const csrfToken = useCsrfToken();
  const { toast } = useToast();

  const form = useForm<ResendActivationSchemaType>({
    mode: "onChange",
    resolver: zodResolver(resendActivationSchema),
    defaultValues: {
      // important so you won't get this uncontrolled error. see: https://reactjs.org/link/controlled-components
      email: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = objectToFormData({
      ...data,
      csrf_token: csrfToken,
    });
    const response: ActionResponse = await resendActivationAction(formData);
    if (response?.error && typeof response?.error === "string") {
      showErrorToast(toast, response.error);
    } else if (response?.error && typeof response?.error === "object") {
      for (const [key, message] of Object.entries(response.error)) {
        form.setError(key as keyof ResendActivationSchemaType, {
          type: "manual",
          message: message as string,
        });
      }
    }

    if (response?.message) {
      showSuccessToast(toast, response.message);
      form.reset();
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. email@example.com"
                  {...field}
                  className={
                    form.formState.errors.email
                      ? "border border-destructive focus-visible:ring-destructive"
                      : "border border-border"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full flex items-center gap-2"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting && (
            <LoaderCircle className="animate-spin" />
          )}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ResendActivationForm;
