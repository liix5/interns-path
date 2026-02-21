"use client";

import * as React from "react";
import { Profession } from "@/app/lib/definitions";
import { useSearchParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

export default function ProfessionFilter({
  professions,
  onSelect,
  isLoading = false,
}: {
  professions: Profession[];
  onSelect: (professions: number[]) => void;
  isLoading?: boolean;
}) {
  const searchParams = useSearchParams();
  const anchor = useComboboxAnchor();

  // Parse initial selected IDs from URL
  const selectedProf = searchParams.get("profession");
  const initialSelected = React.useMemo(() => {
    if (selectedProf && selectedProf !== "all") {
      return selectedProf.split(",").filter(Boolean);
    }
    return [];
  }, [selectedProf]);

  const hasSelections = initialSelected.length > 0;

  // Create a map for profession name lookup
  const professionMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    professions.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [professions]);

  const handleValueChange = (values: string[]) => {
    const numericIds = values.map(Number).filter(Boolean);
    onSelect(numericIds);
  };

  const handleClearAll = () => {
    onSelect([]);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Combobox
          multiple
          value={initialSelected}
          onValueChange={handleValueChange}
          itemToStringValue={(item: string) => professionMap[item] || item}
        >
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>
                      {professionMap[value] || value}
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="ابحث عن التخصص..." />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor} dir="rtl">
            <ComboboxEmpty>لا توجد نتائج</ComboboxEmpty>
            <ComboboxList>
              {professions.map((profession) => (
                <ComboboxItem key={profession.id} value={profession.id}>
                  {profession.name}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Clear all button */}
      {hasSelections && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <X className="size-4 ml-1" />
          مسح الكل
        </Button>
      )}
    </div>
  );
}
