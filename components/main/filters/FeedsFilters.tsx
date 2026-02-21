// components/main/filters/FeedsFilters.tsx
"use client";

import { useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const handleSelect = (selectedIds: number[]) => {
    const params = new URLSearchParams(searchParams);
    params.set(
      "profession",
      selectedIds.length ? selectedIds.join(",") : "all"
    );

    params.set("page", "1");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <ProfessionFilter
      professions={professions}
      onSelect={handleSelect}
      isLoading={isPending}
    />
  );
}
