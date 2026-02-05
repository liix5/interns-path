// lib/data.ts
import postgres, { Sql } from "postgres";
import { Experience, Profession, City } from "./definitions";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

//development database
// const sql = postgres(process.env.DevDB!, { ssl: "require" });

const ITEMS_PER_PAGE = 30;

export async function fetchProfessions(): Promise<Profession[]> {
  try {
    const data = await sql<Profession[]>`SELECT id, name FROM professions`;
    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch professions.");
  }
}
// get the tags from the tags table
export async function fetchTags(): Promise<string[]> {
  try {
    const data = await sql<{ name: string }[]>`SELECT name FROM tags`;
    return data.map((tag) => tag.name);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tags.");
  }
}

export async function fetchCities(): Promise<City[]> {
  try {
    const data = await sql<City[]>`
      SELECT id, name_ar, name_en, region
      FROM cities
      ORDER BY name_ar ASC
    `;
    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch cities.");
  }
}

export async function fetchFilteredExperiences(
  profession: string | null,
  page: number,
  search: string | null = null,
  city: string | null = null,
): Promise<{ experiences: Experience[] }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    // Collect conditions as an array of SQL fragments
    const experiences = await sql<Experience[]>`
      SELECT
        e.id,
        p.name AS profession,
        e.place,
        c.name_ar AS city,
        e.year,
        e.rotation,
        e.description,
        e.positives,
        e.negatives,
        e.requirements,
        e.departments,
        e.working_hours,
        e.interview_info,
        e.contact,
        e.rating,
        e.created_at,
        COALESCE(
          json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM experiences e
      JOIN professions p ON e.profession_id = p.id
      LEFT JOIN cities c ON e.city_id = c.id
      LEFT JOIN experience_tag et ON e.id = et.experience_id
      LEFT JOIN tags t ON et.tag_id = t.id
      ${
        profession && profession !== "all"
          ? sql`WHERE p.id = ${profession}`
          : sql``
      }
      ${
        city && city !== "all"
          ? profession && profession !== "all"
            ? sql` AND c.id = ${city}`
            : sql`WHERE c.id = ${city}`
          : sql``
      }
      ${
        search
          ? (profession && profession !== "all") || (city && city !== "all")
            ? sql` AND (e.place ILIKE ${
                "%" + search + "%"
              } OR e.description ILIKE ${"%" + search + "%"})`
            : sql`WHERE (e.place ILIKE ${
                "%" + search + "%"
              } OR e.description ILIKE ${"%" + search + "%"})`
          : sql``
      }
      GROUP BY e.id, p.id, c.id
      ORDER BY e.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return { experiences };
  } catch (err) {
    console.error("Database Error in fetchFilteredExperiences:", err);
    throw new Error("Failed to fetch experiences.");
  }
}

export async function fetchExperiencesPages(
  profession: string | null,
  search: string | null = null,
  city: string | null = null,
): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(DISTINCT e.id)
      FROM experiences e
      JOIN professions p ON e.profession_id = p.id
      LEFT JOIN cities c ON e.city_id = c.id
      LEFT JOIN experience_tag et ON e.id = et.experience_id
      LEFT JOIN tags t ON et.tag_id = t.id
      ${
        profession && profession !== "all"
          ? sql`WHERE p.id = ${profession}`
          : sql``
      }
      ${
        city && city !== "all"
          ? profession && profession !== "all"
            ? sql` AND c.id = ${city}`
            : sql`WHERE c.id = ${city}`
          : sql``
      }
      ${
        search
          ? (profession && profession !== "all") || (city && city !== "all")
            ? sql` AND (e.place ILIKE ${
                "%" + search + "%"
              } OR e.description ILIKE ${"%" + search + "%"})`
            : sql`WHERE (e.place ILIKE ${
                "%" + search + "%"
              } OR e.description ILIKE ${"%" + search + "%"})`
          : sql``
      }
    `;

    const totalPages = Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error in fetchExperiencesPages:", error);
    throw new Error("Failed to fetch total number of experiences.");
  }
}
//fetch experience by id

export async function fetchExperienceById(
  id: string,
): Promise<Experience | null> {
  try {
    const result = await sql`
      SELECT
        e.id,
        p.name AS profession,
        e.place,
        c.name_ar AS city,
        e.year,
        e.rotation,
        e.description,
        e.positives,
        e.negatives,
        e.requirements,
        e.departments,
        e.working_hours,
        e.interview_info,
        e.contact,
        e.rating,
        e.created_at,
        COALESCE(
          json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM experiences e
      JOIN professions p ON e.profession_id = p.id
      LEFT JOIN cities c ON e.city_id = c.id
      LEFT JOIN experience_tag et ON e.id = et.experience_id
      LEFT JOIN tags t ON et.tag_id = t.id
      WHERE e.id = ${id}
      GROUP BY e.id, p.name, c.name_ar;
    `;

    if (!result || result.length === 0) return null;

    return result[0] as Experience;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch experience by ID.");
  }
}

export async function fetchExperienceForEdit(id: string): Promise<any | null> {
  try {
    const result = await sql`
      SELECT
        e.id,
        e.profession_id,
        e.city_id,
        e.place,
        e.year,
        e.rotation,
        e.description,
        e.positives,
        e.negatives,
        e.requirements,
        e.departments,
        e.working_hours,
        e.interview_info,
        e.contact,
        e.rating,
        COALESCE(
          json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM experiences e
      LEFT JOIN experience_tag et ON e.id = et.experience_id
      LEFT JOIN tags t ON et.tag_id = t.id
      WHERE e.id = ${id}
      GROUP BY e.id;
    `;

    if (!result || result.length === 0) return null;

    return result[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch experience for edit.");
  }
}
