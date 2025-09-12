import { ModeToggle } from "@/components/modeToggle";
import React from "react";
import { Button } from "../ui/button";

export default function NavBar() {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <p className="font-bold text-primary text-lg">Interns Path</p>
      <div className="flex items-center gap-4">
        <Button> شارك تجربتك</Button>
        <ModeToggle />
      </div>
    </div>
  );
}
