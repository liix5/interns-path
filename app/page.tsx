import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUpLeft } from "lucide-react";
import ExperiencesFeed from "@/components/main/Experiences";
import { fetchExperiencesPages, fetchProfessionsWithCounts } from "./lib/data";
import FeedFilters from "@/components/main/filters/FeedsFilters";
import SearchForm from "@/components/main/filters/SearchForm";
import { Suspense } from "react";
import Pagination from "@/components/main/pagination";
import { ProfessionRequestForm } from "@/components/form/professionReqForm";

// Lightweight skeleton for just the feed section
function FeedSkeleton() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-[280px] rounded-xl border bg-card animate-pulse">
          <div className="p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; profession?: string; q?: string | null }>;
}) {
  // Next.js 15: searchParams is now a Promise
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const profession = params.profession || "all";
  const search = params.q || "";

  // Parallel data fetching - both queries run simultaneously
  const [professions, allPages] = await Promise.all([
    fetchProfessionsWithCounts(),
    fetchExperiencesPages(profession, search),
  ]);

  return (
    <div>
      <section className="py-11 items-center flex justify-center mx-8 mt-3 ">
        <div className="container">
          <div className="flex flex-col items-center justify-center text-center ">
            <Badge variant="outline">
              حدد طريقك الان <ArrowUpLeft className="mr-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-3xl font-bold lg:text-6xl">
              شارك تجربتك وحدد طريقك
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              تجربتك تفرق، شاركها، واستفد من تجارب الآخرين في مسار الامتياز
            </p>
            <div className="flex w-full max-w-lg flex-row gap-3">
              <Button asChild className="flex-1 justify-center">
                <a href="/experience-form">شارك تجربتك</a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 justify-center"
              >
                <a href="#experiences">
                  <ArrowDown className=" size-4" />
                  تصفح التجارب
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <hr className="shadow-sm my-3" />
      <section id="experiences" className="scroll-mt-4 p-4">
        <h2 className="text-2xl text-center font-bold ">أحدث التجارب</h2>
        <div className=" pt-6 justify-center mb-2 items-center flex flex-col  gap-3">
          <SearchForm />

          <FeedFilters professions={professions} />
          <p className="text-sm text-center">
            لم تجد تخصصك؟ <ProfessionRequestForm source="الصفحة الرئيسية" />
          </p>
        </div>

        <Suspense key={`${page}-${profession}-${search}`} fallback={<FeedSkeleton />}>
          <ExperiencesFeed
            totalPages={allPages}
            page={page}
            profession={profession}
            search={search}
          />
        </Suspense>

        {/* Pagination */}
        {allPages >= 1 && (
          <div className=" flex justify-center mt-4">
            <Pagination totalPages={allPages} />
          </div>
        )}
      </section>
    </div>
  );
}
