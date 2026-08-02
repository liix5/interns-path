"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ProfessionWithCount } from "@/app/lib/definitions";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfessionFilter({
  professions,
  onSelect,
  isPending = false,
}: {
  professions: ProfessionWithCount[];
  onSelect: (professions: number[]) => void;
  isPending?: boolean;
}) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<number[]>([]);
  const selectedProf = searchParams.get("profession");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(() =>
      selectedProf && selectedProf !== "all" ? [Number(selectedProf)] : [],
    );
  }, [selectedProf]);

  // Fix RTL scroll position on mount (Safari/iOS)
  useEffect(() => {
    if (scrollContainerRef.current) {
      // In RTL, Safari might start scrolled to the left instead of right
      // Reset scroll position to ensure "الكل" is visible
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);

  const handleSelect = (id: number | null) => {
    let newSelection: number[];
    if (id === null) {
      // "الكل" button - reset to all
      newSelection = [];
    } else if (selected.includes(id)) {
      // remove if already selected
      newSelection = selected.filter((p) => p !== id);
    } else {
      // add if not selected (single selection mode)
      newSelection = [id];
    }
    setSelected(newSelection);
    onSelect(newSelection);
  };

  // Sort professions: populated first (by count desc), then empty ones
  const sortedProfessions = [...professions].sort((a, b) => {
    if (a.count === 0 && b.count === 0) return a.name.localeCompare(b.name);
    if (a.count === 0) return 1;
    if (b.count === 0) return -1;
    return b.count - a.count;
  });

  const isAllSelected = selected.length === 0;

  return (
    <div className="relative w-full">
      {/* Loading indicator */}
      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-lg">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-2 overflow-x-auto snap-x snap-proximity scrollbar-thin pb-2 px-1 pr-3.5 transition-opacity",
          isPending && "opacity-50 pointer-events-none",
        )}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x", // Ensure horizontal scrolling on touch devices
        }}
      >
        {/* الكل (All) chip - always first and active by default */}
        <button
          onClick={() => handleSelect(null)}
          className={cn(
            "flex-shrink-0 px-4 py-2 md:py-1.5 rounded-full text-sm border cursor-pointer transition-all duration-200",
            "touch-manipulation", // iOS optimization: prevents 300ms tap delay
            isAllSelected
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-primary/10 border border-primary/60 text-foreground/70 hover:bg-primary/20 hover:border-primary/80",
          )}
        >
          الكل
        </button>

        {sortedProfessions.map((profession, index) => {
          const isSelected = selected.includes(Number(profession.id));
          const isEmpty = profession.count === 0;
          const isLastPopulated =
            profession.count > 0 &&
            (index === sortedProfessions.length - 1 ||
              sortedProfessions[index + 1].count === 0);

          return (
            <button
              key={profession.id}
              onClick={() => handleSelect(Number(profession.id))}
              className={cn(
                "flex-shrink-0  px-4 py-1.5 rounded-full text-sm border cursor-pointer transition-all duration-200",
                "flex items-center gap-1.5",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : isEmpty
                    ? "bg-muted/30 border border-muted-foreground/30 text-muted-foreground/50 hover:bg-muted/50"
                    : "bg-primary/10 border border-primary/60 text-foreground/70 hover:bg-primary/20 hover:border-primary/80",
                isLastPopulated && "ml-0 mr-1",
              )}
            >
              <span>{profession.name}</span>
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : isEmpty
                      ? "bg-muted-foreground/10 text-muted-foreground/40"
                      : "bg-primary/20 text-primary/80",
                )}
              >
                {profession.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fade indicators on edges */}
      <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
