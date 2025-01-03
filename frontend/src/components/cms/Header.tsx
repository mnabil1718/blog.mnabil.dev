import { UserNav } from "./UserNav";
import { getSession } from "@/actions/auth";
import { headers } from "next/headers";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

export default async function Header() {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";
  const session = await getSession();
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 saturate-100 backdrop-blur-[10px] bg-background/80">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      <div className="flex items-center gap-2 px-4">
        <UserNav sessionUser={session.user} csrfToken={csrfToken} />
      </div>
    </header>
  );
}
