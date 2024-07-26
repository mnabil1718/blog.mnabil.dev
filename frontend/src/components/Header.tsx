"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import Link from "@/components/Link";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("scroll", changeBackground);

    return () => document.removeEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-40 flex h-[70px] justify-center border-b border-border",
        "w-full items-center justify-between bg-white px-4 shadow-sm saturate-100 backdrop-blur-[10px]",
        isScrolled && "bg-background/80"
      )}
    >
      <nav className="mx-auto xl:max-w-screen-xl w-full h-[70px] flex items-center justify-between">
        <div>
          <Link href="/" aria-label="#">
            <div className="flex items-center justify-between rounded-full font-bold">
              blog.mnabil.dev
            </div>
          </Link>
        </div>
        <div className="flex items-center sm:space-x-3">
          <ul className="hidden space-x-2 sm:flex">
            <li>
              <Button
                variant="ghost"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Link href="#">Home</Link>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Link href="#">About</Link>
              </Button>
            </li>
          </ul>
          {/* <SearchButton /> */}
          <MobileNav />
        </div>
      </nav>
      {/* <div className={cn()}>
        <div className="sm:max-w-screen-sm xl:max-w-screen-xl mx-auto flex h-[80px] w-full items-center justify-between"></div>
      </div> */}
    </header>
  );
};

export default Header;
