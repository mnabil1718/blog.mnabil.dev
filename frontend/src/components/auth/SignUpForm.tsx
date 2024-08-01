"use client";

import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import useFetchCsrf from "@/hooks/useFetchCsrf";
import { useToast } from "../ui/use-toast";

const schema = z
  .object({
    name: z.string().min(1).max(200),
    email: z.string().email(),
    password: z.string().min(6, "password must be longer than 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

const SignUpForm = () => {
  const { loading, error, csrfToken } = useFetchCsrf();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      // important so you won't get this uncontrolled error. see: https://reactjs.org/link/controlled-components
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const endpoint = "/users";

    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      timeout: 1000,
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      withCredentials: true,
    });

    setIsLoading(true);
    let success: boolean = false;
    try {
      let resp = await instance.post(endpoint, {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      success = true;
    } catch (error) {
      let message = "Failed to submit data";
      if (isAxiosError(error)) {
        const errors = error.response?.data.error;

        if (errors) {
          if (typeof errors === "object") {
            message = Object.entries(errors)
              .map(([_, msg]) => `${msg}`)
              .join(", ");
          } else {
            message = errors;
          }
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        variant: "destructive",
        title: "Oops, Something Went Wrong!",
        description: message,
      });
    } finally {
      setIsLoading(false);

      if (success) {
        form.reset();
        toast({
          title: "Success!",
          description:
            "We've sent an activation link to your email. Please check your email to activate your account.",
        });
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Oops, Something Went Wrong!",
        description: error,
      });
    }
  }, [error, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
          disabled={loading || isLoading}
        >
          {(loading || isLoading) && <LoaderCircle className="animate-spin" />}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
