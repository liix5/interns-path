// This is required to make the component a Client Component
"use client";

import { ModeToggle } from "@/components/modeToggle";
import React from "react";
import { Button } from "../ui/button";
// Import the Next.js hook
import { usePathname } from "next/navigation";

export default function NavBar() {
  // Get the current URL pathname
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <p
        className="font-bold
       text-primary text-lg flex flex-col"
      >
        <a href="/">Interns Path</a>
        <span className="text-xs text-muted-foreground/50"> نسخة اولية</span>
      </p>
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
