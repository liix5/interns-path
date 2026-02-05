"use server";

import { z } from "zod";
import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// development database
// const sql = postgres(process.env.DevDB!, { ssl: "require" });

const ExperienceSchema = z.object({
  profession_id: z.string().min(1, "الرجاء اختيار التخصص"),
  city_id: z.string().min(1, "الرجاء اختيار المدينة"),
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
  interview_info: z.string().optional(),
  contact: z.string().optional(),
});

export type ExperienceState = {
  errors?: Record<string, string[]>;
  message?: string | null;
  experienceId?: string;
  editToken?: string;
};

export async function createExperience(
  prevState: ExperienceState,
  formData: FormData,
): Promise<ExperienceState> {
  const validatedFields = ExperienceSchema.safeParse({
    profession_id: formData.get("profession_id"),
    city_id: formData.get("city_id"),
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
    interview_info: formData.get("interview_info"),
    contact: formData.get("contact"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "⚠️ يرجى تصحيح الأخطاء وإعادة المحاولة.",
    };
  }

  const {
    profession_id,
    city_id,
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
    interview_info,
    contact,
  } = validatedFields.data;

  // Generate unique edit token
  const editToken = crypto.randomUUID();

  try {
    // insert into experiences
    const [experience] = await sql`
      INSERT INTO experiences (
        profession_id, city_id, place, year, rotation, working_hours,
        description, departments, requirements, positives, negatives, rating,
        interview_info, contact, edit_token
      )
      VALUES (
        ${profession_id}, ${city_id}, ${place}, ${year}, ${rotation ?? null}, ${
          working_hours ?? null
        },
        ${description}, ${departments ?? null}, ${
          requirements ?? null
        }, ${positives}, ${negatives}, ${rating},
        ${interview_info ?? null}, ${contact ?? null}, ${editToken}
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
    return {
      message: "✅ تم إضافة تجربتك بنجاح!",
      experienceId: experience.id.toString(),
      editToken: editToken,
    };
  } catch (error) {
    console.error("Database Error in createExperience:", error);

    return {
      message: "❌ Database Error: Failed to create experience. " + error,
    };
  }
}

export async function updateExperience(
  prevState: ExperienceState,
  formData: FormData,
): Promise<ExperienceState> {
  const experienceId = formData.get("experience_id") as string;
  const editToken = formData.get("edit_token") as string;

  if (!experienceId || !editToken) {
    return {
      message: "❌ معرف التجربة أو رمز التعديل مفقود",
    };
  }

  const validatedFields = ExperienceSchema.safeParse({
    profession_id: formData.get("profession_id"),
    city_id: formData.get("city_id"),
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
    interview_info: formData.get("interview_info"),
    contact: formData.get("contact"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "⚠️ يرجى تصحيح الأخطاء وإعادة المحاولة.",
    };
  }

  const {
    profession_id,
    city_id,
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
    interview_info,
    contact,
  } = validatedFields.data;

  try {
    // Verify the edit token
    const [existingExperience] = await sql`
      SELECT id FROM experiences
      WHERE id = ${experienceId} AND edit_token = ${editToken}
    `;

    if (!existingExperience) {
      return {
        message: "❌ رمز التعديل غير صحيح أو التجربة غير موجودة",
      };
    }

    // Update the experience
    await sql`
      UPDATE experiences
      SET
        profession_id = ${profession_id},
        city_id = ${city_id},
        place = ${place},
        year = ${year},
        rotation = ${rotation ?? null},
        working_hours = ${working_hours ?? null},
        description = ${description},
        departments = ${departments ?? null},
        requirements = ${requirements ?? null},
        positives = ${positives},
        negatives = ${negatives},
        rating = ${rating},
        interview_info = ${interview_info ?? null},
        contact = ${contact ?? null}
      WHERE id = ${experienceId}
    `;

    // Delete existing tags for this experience
    await sql`
      DELETE FROM experience_tag
      WHERE experience_id = ${experienceId}
    `;

    // Insert new tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const [tag] = await sql`
          INSERT INTO tags (name)
          VALUES (${tagName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `;

        await sql`
          INSERT INTO experience_tag (experience_id, tag_id)
          VALUES (${experienceId}, ${tag.id})
        `;
      }
    }

    revalidatePath("/");
    revalidatePath(`/experience/${experienceId}`);

    return { message: "✅ تم تحديث تجربتك بنجاح!" };
  } catch (error) {
    console.error("Database Error in updateExperience:", error);
    return {
      message: "❌ Database Error: Failed to update experience. " + error,
    };
  }
}

const ProfessionRequestSchema = z.object({
  profession: z.string().min(2, "الرجاء إدخال تخصص صحيح"),
  source: z.string().optional(),
});

export type ProfessionRequestState = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

export async function sendProfessionRequest(
  prevState: ProfessionRequestState,
  formData: FormData,
): Promise<ProfessionRequestState> {
  const validatedFields = ProfessionRequestSchema.safeParse({
    profession: formData.get("profession"),
    source: formData.get("source"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "⚠️ يرجى تصحيح الأخطاء وإعادة المحاولة.",
    };
  }

  const { profession, source } = validatedFields.data;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // internspath@gmail.com
        pass: process.env.GMAIL_PASS, // App password
      },
    });

    await transporter.sendMail({
      from: `"Interns Path" <${process.env.GMAIL_USER}>`,
      to: "internspath@gmail.com",
      subject: " طلب إضافة تخصص جديد",
      text: `قام مستخدم بطلب إضافة التخصص التالي:\n\n${profession}\n\nمصدر الطلب: ${source || "غير محدد"}`,
      html: `<p>قام مستخدم بطلب إضافة التخصص التالي:</p><p><b>${profession}</b></p><p><small>مصدر الطلب: ${source || "غير محدد"}</small></p>`,
    });

    console.log("Profession request email sent successfully");
  } catch (error) {
    return { message: "❌ فشل إرسال الطلب: " + error };
  }

  return { message: " تم إرسال طلبك بنجاح!" };
}
