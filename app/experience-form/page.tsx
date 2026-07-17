import ExperienceForm from "@/components/form/multi-stepsForm";
import { fetchCities, fetchProfessions, fetchTags } from "../lib/data";
import type { Metadata } from "next";

const title = "قيّم مستشفى امتيازك — مسار الامتياز";
const description =
  "تجربتك تفرق مع اللي بعدك — قيّم مستشفى امتيازك في دقيقتين";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://internspath.com/experience-form",
    siteName: "InternsPath",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og-write.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-write.png"],
  },
};

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
