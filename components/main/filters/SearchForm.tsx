// components/main/filters/SearchForm.tsx
"use client";

import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    router.push(`/?${params.toString()}`);
  }, 300);

  return (
    <div className="flex gap-3">
      <input
        type="text"
        name="q"
        defaultValue={searchParams.get("q")?.toString() || ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="ابحث في التجارب..."
        className="border w-73 rounded-md px-3 py-2"
      />
      {<Search className="absolute size-4 mt-3 mr-66 text-muted-foreground" />}
    </div>
  );
}
