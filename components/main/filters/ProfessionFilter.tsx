"use client";

import { useRouter, useSearchParams } from "next/navigation";

type ProfessionFilterProps = {
  options: string[];
};

export default function ProfessionFilter({ options }: ProfessionFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("profession") || "";

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("profession", value);
    } else {
      params.delete("profession");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="profession" className="text-sm font-medium">
        اختر التخصص
      </label>
      <select
        id="profession"
        value={current}
        onChange={handleChange}
        className="rounded-lg border border-gray-300 p-2 text-sm"
      >
        <option value="">الكل</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
