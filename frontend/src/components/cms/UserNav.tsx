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
import { LogOut } from "lucide-react";
import { SessionData, SessionUser } from "@/lib/session";
import objectToFormData from "@/utils/object-to-form-data";
import { logoutAction } from "@/actions/auth";

export function UserNav({
  sessionUser,
  csrfToken,
}: {
  sessionUser: SessionUser;
  csrfToken: string;
}) {
  const logoutHandler = async () => {
    const data = { csrf_token: csrfToken };
    const formData = objectToFormData(data);
    await logoutAction(formData);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"default"} className="relative h-8 w-8 rounded-full">
          {sessionUser.name[0].toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none line-clamp-1">
              {sessionUser.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {sessionUser.email}
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
