import ExperienceForm from "@/components/form/multi-stepsForm";
import { fetchCities, fetchProfessions, fetchTags } from "../lib/data";

export default async function ExperienceFormPage() {
  const professions = await fetchProfessions();
  const tags = await fetchTags();
  const cities = await fetchCities();
  return (
    <div>
      <ExperienceForm professions={professions} tags={tags} cities={cities} />
    </div>
  );
}
