import ExperienceForm from "@/components/form/multi-stepsForm";
import { fetchProfessions, fetchTags } from "../lib/data";

export default async function ExperienceFormPage() {
  const professions = await fetchProfessions();
  const tags = await fetchTags();
  return (
    <div>
      <ExperienceForm professions={professions} tags={tags} />
    </div>
  );
}
