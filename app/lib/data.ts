// lib/data.ts
import postgres from "postgres";
import { Experience } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredExperiences(
  profession: string | null,
  page: number
): Promise<Experience[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  try {
    if (!profession || profession === "all") {
      return await sql<Experience[]>`
        SELECT *
        FROM experiences
        ORDER BY created_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
    }

    return await sql<Experience[]>`
      SELECT *
      FROM experiences
      WHERE profession = ${profession}
      ORDER BY created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch experiences.");
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
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch experiences count.");
  }
}
