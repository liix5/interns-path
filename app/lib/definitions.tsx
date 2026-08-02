export type City = {
  id: string;
  name_ar: string;
  name_en?: string;
  region?: string;
};

export type Experience = {
  id: string;
  profession: string | number[];
  place: string;
  city?: string;
  city_id?: number;
  year: Date;
  rotation: string;
  tags?: string[];
  rating?: number;
  description: string;
  positives: string;
  negatives: string;
  requirements?: string;
  departments?: string;
  working_hours?: string;
  interview_info?: string;
  contact?: string;
  createdAt: string;
};

export type Profession = {
  id: string;
  name: string;
};

export type ProfessionWithCount = Profession & {
  count: number;
};

import { z } from "zod";

export const feedbackSchema = z.object({
  type: z.enum(["suggestion", "complaint", "question", "general"]),
  message: z.string().min(10, "الرسالة قصيرة جداً"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
});
