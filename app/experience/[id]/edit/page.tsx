import { notFound, redirect } from "next/navigation";
import { fetchExperienceForEdit, fetchProfessions, fetchTags, fetchCities } from "@/app/lib/data";
import ExperienceEditForm from "@/components/form/ExperienceEditForm";

export default async function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const experience = await fetchExperienceForEdit(params.id);

  if (!experience) return notFound();

  const [professions, tags, cities] = await Promise.all([
    fetchProfessions(),
    fetchTags(),
    fetchCities(),
  ]);

  return (
    <main dir="rtl" className="w-full mt-11 flex items-center justify-center p-4">
      <ExperienceEditForm
        experience={experience}
        professions={professions}
        tags={tags}
        cities={cities}
      />
    </main>
  );
}
