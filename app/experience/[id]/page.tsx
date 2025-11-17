import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import ExperienceCard from "@/components/Experience/ExperienceCard";
import { Experience } from "@/app/lib/definitions";
import { fetchExperienceById } from "@/app/lib/data";

export default async function ExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const experience = await fetchExperienceById(params.id);

  if (!experience) return notFound();

  return (
    <div className="m-8" dir="rtl">
      <ExperienceCard experience={experience} />
    </div>
  );
}
