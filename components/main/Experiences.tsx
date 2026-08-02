import ExperienceCardPreview from "@/components/main/ExperienceCardPreview";
import { fetchFilteredExperiences } from "@/app/lib/data";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";

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
    search,
  );

  return (
    <div className="mt-8">
      {/* Cards */}
      {experiences?.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center  px-6 py-10 text-center">
          <Frown className="mb-4 size-8 text-primary" />
          <h2 className="text-lg font-semibold text-primary">
            لا توجد تجارب تطابق بحثك
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            لم تجد تجارب في مجالك؟ شارك تجربتك، وشارك المنصة مع زملائك في التخصص
            للمساهمة في إضافة تجارب جديدة.
          </p>
          <Button asChild className="mt-6">
            <a href="/experience-form">شارك تجربتك</a>
          </Button>
        </div>
      ) : (
        <ul className="grid auto-rows-fr gap-6 md:grid-cols-2 lg:grid-cols-3">
          {experiences?.map((exp) => (
            <li key={exp.id}>
              <ExperienceCardPreview experience={exp} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
