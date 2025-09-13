import Link from "next/link";
import ExperienceCardPreview from "@/components/main/ExperienceCardPreview";
import { Experience } from "@/app/lib/definitions";
import { Loader2 } from "lucide-react";
import { fetchFilteredExperiences } from "@/app/lib/data";
import Pagination from "./pagination";

type ExperiencesFeedProps = {
  page: number;
  profession: string;
  search: string;
  totalPages: number;
};

export default async function ExperiencesFeed({
  profession,
  page,
  search,
  totalPages,
}: ExperiencesFeedProps) {
  const { experiences } = await fetchFilteredExperiences(
    profession,
    page,
    search
  );
  console.log({ totalPages });

  return (
    <div className="mt-8">
      {/* Cards */}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
