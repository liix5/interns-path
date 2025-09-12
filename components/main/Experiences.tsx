// components/main/ExperiencesFeed.tsx
import {
  fetchFilteredExperiences,
  fetchExperiencesPages,
} from "@/app/lib/data";
import Link from "next/link";
import ExperienceCardPreview from "@/components/main/ExperienceCardPreview"; // 👈 نستعمل الكارد الجاهز

type ExperiencesFeedProps = {
  profession?: string;
  page?: number;
};

export default async function ExperiencesFeed({
  profession = "all",
  page = 2,
}: ExperiencesFeedProps) {
  // const [experiences, totalPages] = await Promise.all([
  //   fetchFilteredExperiences(profession, page),
  //   fetchExperiencesPages(profession),
  // ]);

  const totalPages = 3;

  const experiences = [
    {
      id: 1,
      profession: "العلاج الوظيفي",
      place: "مدينة الملك فهد الطبية",
      year: "2023",
      rotation: "الأول",
      tags: ["تعليمي", "ضغط عالي", "أطفال"],
      rating: 4,
      experience:
        "التجربة كانت ممتازة، كان فيه تنظيم واضح لكل طالب. الأخصائيين متعاونين ويعطونك فرص تمسك حالات بنفسك. في البداية كنت متوتر لكن مع الوقت اكتسبت ثه كبيييره ونتعود ونجرب ونشوف ونحالو كل يوم يوم افضل الاخصائيين اساطيييير رهيبين كلهم ممتعين مره الان نحاول مره اخرى ة.",
    },
    {
      id: 2,
      profession: "العلاج الطبيعي",
      place: "مستشفى الحرس الوطني",
      year: "2022",
      rotation: "الثاني",
      tags: ["عظام", "أعصاب"],
      rating: 5,
      experience:
        "أفضل تجربة مررت بها. البيئة تعليمية بشكل كبير وكان فيه مشرف مخصص لكل طالب. شفت حالات متنوعة بين إصابات رياضية وحالات عصبية.",
    },
    {
      id: 3,
      profession: "التخاطب",
      place: "مستشفى الملك خالد الجامعي",
      year: "2024",
      rotation: "الأول",
      tags: ["أطفال", "لغة", "نطق"],
      rating: 3,
      experience:
        "كان عندي صعوبة بالبداية لأن الدوام طويل، لكن المشرفين أعطوني وقت أتعلم فيه بشكل تدريجي. شفت حالات تأخر لغوي ونطق غير سليم. قدمنا برزنتيشن جماعي.",
    },
  ];

  return (
    <div className="mt-8">
      {/* Cards */}
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiences.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            لا توجد تجارب متاحة
          </p>
        ) : (
          experiences.map((exp) => (
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
