"use client";

import { Github, Mail, Twitter } from "lucide-react";

import Link from "./Link";

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <Link
            href="#"
            className="text-muted-foreground hover:brightness-125"
            aria-label="Twitter"
            title="Twitter (@enscry)"
          >
            <Twitter size={24} />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:brightness-125"
            aria-label="Email"
            title="Email (jason -at- enscribe -dot- dev)"
          >
            <Mail size={24} />
          </Link>
          <Link
            href="#"
            className="text-muted-foreground hover:brightness-125"
            aria-label="GitHub"
            title="GitHub (/jktrn)"
          >
            <Github size={24} />
          </Link>
        </div>

        <div className="mb-10 flex space-x-2 text-sm text-muted-foreground">
          <div>mnabil</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">blog.mnabil.dev</Link>
        </div>
      </div>
    </footer>
  );
}
