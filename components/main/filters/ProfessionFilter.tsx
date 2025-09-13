"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Profession } from "@/app/lib/definitions";
import { useSearchParams } from "next/navigation";

export default function ProfessionFilter({
  professions,
  onSelect,
}: {
  professions: Profession[];
  onSelect: (professions: number[]) => void;
}) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<number[]>([]);
  const selectedProf = searchParams.get("profession");

  useEffect(() => {
    setSelected(() => (selectedProf ? [Number(selectedProf)] : []));
  }, [selectedProf]);

  const handleSelect = (id: number) => {
    let newSelection: number[];
    if (selected.includes(id)) {
      // remove if already selected
      newSelection = selected.filter((p) => p !== id);
    } else {
      // add if not selected
      newSelection = [id];
    }
    setSelected(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="flex flex-wrap justify-center items-center  gap-2">
      {professions.map((profession) => (
        <button
          key={profession.id}
          onClick={() => handleSelect(Number(profession.id))}
          className={cn(
            "px-3 py-1 rounded-full text-xs md:text-sm border cursor-pointer transition-colors",
            selected.includes(Number(profession.id))
              ? "bg-primary text-primary-foreground border-primary"
              : " bg-primary/20 border border-primary/80 text-foreground/80 hover:bg-accent"
          )}
        >
          {profession.name}
        </button>
      ))}
    </div>
  );
}
