// lib/data.ts
import postgres, { Sql } from "postgres";
import { Experience, Profession } from "./definitions";
import { revalidatePath } from "next/cache";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ITEMS_PER_PAGE = 2;

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

export async function fetchFilteredExperiences(
  profession: string | null,
  page: number,
  search: string | null = null
): Promise<{ experiences: Experience[]; totalPages: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  console.log({ profession, page, offset, search });

  try {
    // Collect conditions as an array of SQL fragments
    const experiences = await sql<Experience[]>`
      SELECT 
        e.id,
        p.name AS profession,
        e.place,
        e.year,
        e.rotation,
        e.description,
        e.positives,
        e.negatives,
        e.requirements,
        e.departments,
        e.working_hours,
        e.rating,
        e.created_at,
        COALESCE(
          json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM experiences e
      JOIN professions p ON e.profession_id = p.id
      LEFT JOIN experience_tag et ON e.id = et.experience_id
      LEFT JOIN tags t ON et.tag_id = t.id
      ${
        profession && profession !== "all"
          ? sql`WHERE p.id = ${profession}`
          : sql``
      }
      ${
        search
          ? profession && profession !== "all"
            ? sql` AND (e.place ILIKE ${
                "%" + search + "%"
              } OR e.description ILIKE ${"%" + search + "%"})`
            : sql`WHERE (e.place ILIKE ${
                "%" + search + "%"
              } OR e.description ILIKE ${"%" + search + "%"})`
          : sql``
      }
      GROUP BY e.id, p.id
      ORDER BY e.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    // Fetch total count for pagination
    const totalCount = await sql`
  SELECT COUNT(*) FROM experiences e
  WHERE 1=1
  ${
    profession && profession !== "all"
      ? sql`AND e.profession_id = (SELECT id FROM professions WHERE name = ${profession})`
      : sql``
  }
  ${
    search
      ? sql`AND (e.place ILIKE ${"%" + search + "%"} OR e.description ILIKE ${
          "%" + search + "%"
        })`
      : sql``
  }
`;

    const totalPages = Math.ceil(Number(totalCount[0].count) / ITEMS_PER_PAGE);
    console.log({ totalCount, totalPages, experiences });
    return { experiences, totalPages };
  } catch (err) {
    console.error("Database Error in fetchFilteredExperiences:", err);
    throw new Error("Failed to fetch experiences.");
  }
}

//fetch experience by id

export async function fetchExperienceById(
  id: string
): Promise<Experience | null> {
  try {
    const result = await sql`
      SELECT 
        e.id,
        p.name AS profession,
        e.place,
        e.year,
        e.rotation,
        e.description,
        e.positives,
        e.negatives,
        e.requirements,
        e.departments,
        e.working_hours,
        e.rating,
        e.created_at,
        COALESCE(
          json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]'
        ) AS tags
      FROM experiences e
      JOIN professions p ON e.profession_id = p.id
      LEFT JOIN experience_tag et ON e.id = et.experience_id
      LEFT JOIN tags t ON et.tag_id = t.id
      WHERE e.id = ${id}
      GROUP BY e.id, p.name;
    `;

    if (!result || result.length === 0) return null;

    return result[0] as Experience;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch experience by ID.");
  }
}

export async function fetchExperiencesPages(
  profession: string | null
): Promise<number> {
  try {
    let countResult;
    if (!profession || profession === "all") {
      countResult = await sql`SELECT COUNT(*) FROM experiences`;
    } else {
      countResult = await sql`
        SELECT COUNT(*) FROM experiences
        WHERE profession = ${profession}
      `;
    }

    const totalItems = Number(countResult[0].count ?? "0");
    revalidatePath("/");
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch experiences count.");
  }
}
