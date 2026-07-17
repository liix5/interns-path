"use client";

import { ModeToggle } from "@/components/modeToggle";
import React from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <a href="/" className="flex items-center gap-1">
        {/* Logo mark - never mirrors for RTL */}
        <Image
          src="/mark-violet.svg"
          alt="InternsPath"
          width={36}
          height={36}
          className="dark:hidden"
          style={{ transform: "none" }}
        />
        <Image
          src="/mark-dark-ui.svg"
          alt="InternsPath"
          width={36}
          height={36}
          className="hidden dark:block"
          style={{ transform: "none" }}
        />
        <span className="flex flex-col justify-center  leading-none">
          <span className="font-bold text-primary">مسار الامتياز</span>
          <span className="mt-1 text-[10px] text-muted-foreground">
            InternsPath
          </span>
        </span>
      </a>
      <div className="flex items-center gap-4">
        {/* Conditionally render the button based on the pathname */}
        {pathname !== "/experience-form" && (
          <Button asChild>
            <a href="/experience-form">شارك تجربتك</a>
          </Button>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
