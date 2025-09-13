"use client";

import Link from "next/link";
import ExperienceCardPreview from "@/components/main/ExperienceCardPreview";
import { Experience } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";

type ExperiencesFeedProps = {
  experiences: Experience[];
  page: number;
  profession: string;
  totalPages: number;
};

export default function ExperiencesFeed({
  experiences,
  page,
  profession,
  totalPages,
}: ExperiencesFeedProps) {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the component first renders or when search parameters change, set loading to true
    // This assumes the data is fetched and passed as a prop from a parent Server Component
    setLoading(true);
    // You can also add a cleanup function here if needed
  }, [searchParams]);

  useEffect(() => {
    // When the `experiences` prop is updated (which means the new data has arrived),
    // set loading to false
    if (experiences) {
      setLoading(false);
    }
  }, [experiences]);

  return (
    <div className="mt-8">
      {/* Cards */}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <Loader2 className="animate-spin mx-auto mb-4" />}
        {experiences?.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            لا توجد تجارب متاحة
          </p>
        ) : (
          experiences?.map((exp) => (
            <li key={exp.id}>
              <ExperienceCardPreview experience={exp} />
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <Link
              href={`/?profession=${profession}&page=${page - 1}`}
              className="px-3 py-1.5 border rounded-md text-sm hover:bg-accent"
            >
              السابق
            </Link>
          )}

          <span className="text-sm text-muted-foreground">
            الصفحة {page} من {totalPages}
          </span>

          {page < totalPages && (
            <Link
              href={`/?profession=${profession}&page=${page + 1}`}
              className="px-3 py-1.5 border rounded-md text-sm hover:bg-accent"
            >
              التالي
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
