import ExperienceCardPreview from "@/components/main/ExperienceCardPreview";
import { fetchFilteredExperiences } from "@/app/lib/data";
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
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {experiences?.length === 0 ? (
          <>
            <p className=" flex text-primary items-center justify-center mt-3  ">
              لا توجد نتائج تطابق بحثك
              <Frown className=" mr-2 text-primary justify-center" />
            </p>
            <p className="text-center mb-12 text-muted-foreground text-sm">
              لم تجد تجارب في مجالك؟
              <br />
              شارك الموقع في مجتمعك وساهم في إضافة تجارب جديدة{" "}
            </p>
          </>
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
