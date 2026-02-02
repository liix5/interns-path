import ExperienceCardPreview from "@/components/main/ExperienceCardPreview";
import { fetchFilteredExperiences } from "@/app/lib/data";

type ExperiencesFeedProps = {
  page: number;
  profession: string;
  city: string | null;
  search: string;
  totalPages: number;
};

export default async function ExperiencesFeed({
  profession,
  page,
  city,
  search,
  totalPages,
}: ExperiencesFeedProps) {
  const { experiences } = await fetchFilteredExperiences(
    profession,
    page,
    search,
    city
  );

  return (
    <div className="mt-8">
      {/* Cards */}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {experiences?.length === 0 ? (
          <p className="col-span-full my-3 text-center text-muted-foreground">
            لا توجد نتائج تطابق بحثك
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
