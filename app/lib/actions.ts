"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ExperienceSchema = z.object({
  profession_id: z.string().min(1, "الرجاء اختيار التخصص"),
  place: z.string().min(2, "الرجاء إدخال اسم المكان"),
  year: z.string(),
  rotation: z.string().optional(),
  working_hours: z.string().optional(),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  departments: z.string().optional(),
  requirements: z.string().optional(),
  positives: z.string().min(3, "الإيجابيات يجب أن تكون 3 أحرف على الأقل"),
  negatives: z.string().min(3, "السلبيات يجب أن تكون 3 أحرف على الأقل"),
  rating: z.number().min(1).max(5),
  tags: z.array(z.string()).optional(),
});

export type ExperienceState = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

export async function createExperience(
  prevState: ExperienceState,
  formData: FormData
): Promise<ExperienceState> {
  const validatedFields = ExperienceSchema.safeParse({
    profession_id: formData.get("profession_id"),
    place: formData.get("place"),
    year: formData.get("year"),
    rotation: formData.get("rotation"),
    working_hours: formData.get("working_hours"),
    description: formData.get("description"),
    departments: formData.get("departments"),
    requirements: formData.get("requirements"),
    positives: formData.get("positives"),
    negatives: formData.get("negatives"),
    rating: Number(formData.get("rating")),
    tags: formData.getAll("tags") as string[],
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "⚠️ يرجى تصحيح الأخطاء وإعادة المحاولة.",
    };
  }

  const {
    profession_id,
    place,
    year,
    rotation,
    working_hours,
    description,
    departments,
    requirements,
    positives,
    negatives,
    rating,
    tags,
  } = validatedFields.data;

  try {
    // insert into experiences
    const [experience] = await sql`
      INSERT INTO experiences (
        profession_id, place, year, rotation, working_hours,
        description, departments, requirements, positives, negatives, rating
      )
      VALUES (
        ${profession_id}, ${place}, ${year}, ${rotation}, ${working_hours},
        ${description}, ${departments}, ${requirements}, ${positives}, ${negatives}, ${rating}
      )
      RETURNING id
    `;

    // insert tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // make sure tag exists or insert it
        const [tag] = await sql`
          INSERT INTO tags (name) 
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

        await sql`
          INSERT INTO experience_tag (experience_id, tag_id)
          VALUES (${experience.id}, ${tag.id})
        `;
      }
    }
  } catch (error) {
    return {
      message: "❌ Database Error: Failed to create experience. " + error,
    };
  }

  revalidatePath("/");
  redirect("/");
}
