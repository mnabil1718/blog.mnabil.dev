"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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
    token: z.string().min(1).max(200),
  })
  .refine((data) => new TextEncoder().encode(data.token).length === 26, {
    message: "Invalid token",
    path: ["token"],
  });

const ActivationForm = () => {
  const router = useRouter();
  const { loading, error, csrfToken } = useFetchCsrf();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordVisible, setpasswordVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      // important so you won't get this uncontrolled error. see: https://reactjs.org/link/controlled-components
      token: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const endpoint = "/users/activation";

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
      let resp = await instance.put(endpoint, {
        token: values.token,
      });
      success = true;
    } catch (error) {
      let message = "Failed to submit data";
      if (error instanceof AxiosError) {
        message = error.response?.data.error.token;
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
        router.push("/login?activationSuccess");
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
          disabled={loading || isLoading}
        >
          {(loading || isLoading) && <LoaderCircle className="animate-spin" />}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ActivationForm;
