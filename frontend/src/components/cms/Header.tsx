import { cn } from "@/lib/utils";
import { MobileSidebar } from "./MobileSidebar";
import { UserNav } from "./UserNav";
import { testHealthCheck } from "@/actions/auth";
import { getCsrfToken } from "@/utils/fetch_tokens";

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 w-full border-b">
      <nav className="flex items-center justify-between p-4 md:justify-end">
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </nav>
    </header>
  );
}
