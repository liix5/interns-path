// components/main/filters/FeedsFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Profession } from "@/app/lib/definitions";
import ProfessionFilter from "./ProfessionFilter";

export default function FeedFilters({
  professions,
}: {
  professions: Profession[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (selectedIds: number[]) => {
    const params = new URLSearchParams(searchParams);
    params.set(
      "profession",
      selectedIds.length ? selectedIds.join(",") : "all"
    );

    params.set("page", "1");

    router.push(`/?${params.toString()}`);
  };

  return <ProfessionFilter professions={professions} onSelect={handleSelect} />;
}
