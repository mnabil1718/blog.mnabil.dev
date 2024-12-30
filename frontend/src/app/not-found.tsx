import { Redo2 } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-7xl font-bold">404</h1>
          <h2>NotFoundError</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Could not find requested resource</p>
          <Link
            href="/"
            className="mx-auto w-fit px-3 py-2 rounded-full border border-slate-300 hover:text-foreground hover:border-slate-400 flex items-center flex-wrap gap-2"
          >
            <Redo2 className="scale-x-[-1]" size={15} />{" "}
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
