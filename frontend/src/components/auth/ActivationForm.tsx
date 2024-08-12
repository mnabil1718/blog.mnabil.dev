"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LoaderCircle, User } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
  activationSchema,
  ActivationSchemaType,
} from "@/validations/activation";
import objectToFormData from "@/utils/object-to-form-data";
import { AuthActionResponse } from "@/actions/auth-types";
import { activationAction } from "@/actions/auth";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";

const ActivationForm = ({ csrfToken }: { csrfToken: string }) => {
  const { toast } = useToast();
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);

  const form = useForm<ActivationSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(activationSchema),
    defaultValues: {
      // important so you won't get this uncontrolled error. see: https://reactjs.org/link/controlled-components
      token: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = objectToFormData({
      ...data,
      csrf_token: csrfToken,
    });
    const response: AuthActionResponse = await activationAction(formData);
    if (response?.error && typeof response?.error === "string") {
      showErrorToast(toast, response.error);
    } else if (response?.error && typeof response?.error === "object") {
      for (const [key, message] of Object.entries(response.error)) {
        form.setError(key as keyof ActivationSchemaType, {
          type: "manual",
          message,
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
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <FormControl>
                <div className="relative">
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="absolute right-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setpasswordVisible(!passwordVisible);
                    }}
                  >
                    {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter Token"
                    autoComplete="new-password"
                    {...field}
                    className={cn(
                      "pr-11",
                      form.formState.errors.token
                        ? "border border-destructive focus-visible:ring-destructive"
                        : "border border-border"
                    )}
                  />
                </div>
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

export default ActivationForm;
