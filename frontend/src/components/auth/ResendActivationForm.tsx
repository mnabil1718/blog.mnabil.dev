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
import { Eye, EyeOff, LoaderCircle, User } from "lucide-react";
import useFetchCsrf from "@/hooks/useFetchCsrf";
import { useToast } from "../ui/use-toast";

const schema = z.object({
  email: z.string().email(),
});

const ResendActivationForm = () => {
  const { loading, error, csrfToken } = useFetchCsrf();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const endpoint = "/tokens/activation";

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
        email: values.email,
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
          disabled={loading || isLoading}
        >
          {(loading || isLoading) && <LoaderCircle className="animate-spin" />}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ResendActivationForm;
