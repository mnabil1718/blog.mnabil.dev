"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useFetchCsrf from "@/hooks/useFetchCsrf";
import { LogOut } from "lucide-react";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import useAuthStore, { emptyUser } from "@/stores/authStore";

export function UserNav() {
  const authToken = useAuthStore((state) => state.auth_token);
  const setAuthToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const { error, csrfToken } = useFetchCsrf();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Oops, something went wrong",
        description: error,
      });
    }
  }, [error]);

  const logoutHandler = async () => {
    if (authToken == "") {
      router.push("/login?authenticationFail");
      return;
    }
    let success: boolean = false;
    try {
      let resp = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/authentication`,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
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
      if (success) {
        setAuthToken("");
        setUser(emptyUser);
        router.push("/login");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"default"} className="relative h-8 w-8 rounded-full">
          M
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Muhammad nabil</p>
            <p className="text-xs leading-none text-muted-foreground">
              cucibaju123@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutHandler}>
          Logout{" "}
          <DropdownMenuShortcut>
            <LogOut fontWeight={"bold"} className="text-red-500" size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
