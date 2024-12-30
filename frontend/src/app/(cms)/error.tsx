"use client";

import { IterationCcw, Redo2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-full text-center">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-7xl font-bold">500</h1>
          <h2>InternalServerError</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>{error.message}</p>
          <button
            onClick={() => reset()}
            className="mx-auto w-fit px-3 py-2 rounded-full border border-slate-300 hover:text-foreground hover:border-slate-400 flex items-center flex-wrap gap-2"
          >
            <IterationCcw className="-rotate-180" size={15} />{" "}
            <span>Try again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
