import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import ExperiencesFeed from "@/components/main/Experiences";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import { fetchFilteredExperiences, fetchProfessions } from "./lib/data";
import ProfessionFilter from "@/components/main/filters/ProfessionFilter";
import FeedFilters from "@/components/main/filters/FeedsFilters";
import SearchForm from "@/components/main/filters/SearchForm";
import { Suspense } from "react";
import Loading from "./loading";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string; profession?: string; q?: string | null };
}) {
  // REMOVE THIS LINE:
  // await searchParams;
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const profession = searchParams.profession || "all";
  const search = searchParams.q || null;

  console.log({ searchParams, profession, page, search });

  const professions = await fetchProfessions();

  const { experiences, totalPages } = await fetchFilteredExperiences(
    profession,
    page,
    search
  );

  return (
    <div>
      <section className="py-11 mx-8 my-3">
        <div className="container">
          <div className="flex flex-col items-center text-center ">
            <Badge variant="outline">
              حدد طريقك الان <ArrowUpLeft className="mr-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-3xl font-bold lg:text-6xl">
              شارك تجربتك وحدد طريقك
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              شارك تجربتك واقرا تجارب الاخرين لتحدد الاختيار الافضل للتدريب في
              سنه الامتياز
            </p>
            <Button asChild className="w-full justify-center max-w-lg">
              <a href="/experience-form"> شارك تجربتك</a>
            </Button>
          </div>
        </div>
      </section>
      <hr className="shadow-sm my-4" />
      <section id="experiences" className=" p-4">
        <h2 className="text-2xl text-center font-bold ">تجارب المستخدمين</h2>
        <div className=" pt-6 justify-center mb-2 items-center flex flex-col md:flex-row gap-7">
          <SearchForm />
          <FeedFilters professions={professions} />
        </div>
        <Suspense fallback={<Loading />}>
          <ExperiencesFeed
            page={page}
            profession={profession}
            experiences={experiences}
            totalPages={totalPages}
          />
        </Suspense>
      </section>
    </div>
  );
}
