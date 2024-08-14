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
import { signUpSchema, signUpSchemaType } from "@/validations/signup";
import { signupAction } from "@/actions/auth";
import objectToFormData from "@/utils/object-to-form-data";
import { AuthActionResponse } from "@/actions/auth-types";
import { showErrorToast, showSuccessToast } from "@/utils/show-toasts";
import { useToast } from "../ui/use-toast";

const SignUpForm = ({ csrfToken }: { csrfToken: string }) => {
  const { toast } = useToast();
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<boolean>(false);

  const form = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      // important so you won't get this uncontrolled error. see: https://reactjs.org/link/controlled-components
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = objectToFormData({
      ...data,
      csrf_token: csrfToken,
    });
    const response: AuthActionResponse = await signupAction(formData);
    if (response?.error && typeof response?.error === "string") {
      showErrorToast(toast, response.error);
    } else if (response?.error && typeof response?.error === "object") {
      for (const [key, message] of Object.entries(response.error)) {
        form.setError(key as keyof signUpSchemaType, {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. John Doe"
                  {...field}
                  className={
                    form.formState.errors.name
                      ? "border border-destructive focus-visible:ring-destructive"
                      : "border border-border"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    {...field}
                    className={cn(
                      "pr-11",
                      form.formState.errors.password
                        ? "border border-destructive focus-visible:ring-destructive"
                        : "border border-border"
                    )}
                  />
                </div>
              </FormControl>
              {form.formState.errors.password ? (
                <FormMessage />
              ) : (
                <p className="text-xs text-muted-foreground">
                  Password must be atleast 6 characters long.
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <div className="relative">
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="absolute right-0"
                    onClick={(e) => {
                      e.preventDefault();
                      setpasswordConfirmationVisible(
                        !passwordConfirmationVisible
                      );
                    }}
                  >
                    {passwordConfirmationVisible ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                  <Input
                    type={passwordConfirmationVisible ? "text" : "password"}
                    placeholder="Enter Password Confirmation"
                    autoComplete="new-password"
                    {...field}
                    className={cn(
                      "pr-11",
                      form.formState.errors.password_confirmation
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

export default SignUpForm;
