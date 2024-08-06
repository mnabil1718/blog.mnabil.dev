import { cn } from "@/lib/utils";
import { MobileSidebar } from "./MobileSidebar";
import { UserNav } from "./UserNav";
import { getSession } from "@/actions/auth";
import { headers } from "next/headers";

export default async function Header() {
  const csrfToken = headers().get("X-CSRF-Token") || "missing";
  const session = await getSession();
  return (
    <header className="sticky inset-x-0 top-0 w-full border-b">
      <nav className="flex items-center justify-between p-4 md:justify-end">
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav sessionUser={session.user} csrfToken={csrfToken} />
        </div>
      </nav>
    </header>
  );
}
