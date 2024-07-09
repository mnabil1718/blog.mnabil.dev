"use client";

import { Menu, X } from "lucide-react";
import { Fragment, useState } from "react";
import Link from "./Link";

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = "auto";
      } else {
        // Prevent scrolling
        document.body.style.overflow = "hidden";
      }
      return !status;
    });
  };

  return (
    <>
      {!navShow ? (
        <button
          aria-label="Toggle Menu"
          onClick={onToggleNav}
          className="sm:hidden"
        >
          <Menu />
        </button>
      ) : (
        <button
          aria-label="Toggle Menu"
          onClick={onToggleNav}
          className="sm:hidden"
        >
          <X />
        </button>
      )}

      {navShow && (
        <nav className="absolute bg-white p-4 sm:hidden inset-x-0 h-screen top-[70px]">
          <ul className="space-y-5">
            <li>
              <button className="w-full text-left text-muted-foreground hover:text-foreground">
                <Link href="#">Home</Link>
              </button>
            </li>
            <li>
              <button className="w-full text-left font-medium text-muted-foreground hover:text-foreground">
                <Link href="#">About</Link>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default MobileNav;
