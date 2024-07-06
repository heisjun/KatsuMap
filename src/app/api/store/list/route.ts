import { KatsuInfo } from "@/app/_lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: { url: string | URL }) {
  noStore();
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("user_email");
    const order = searchParams.get("order");

    if (order) {
      const data = await sql<KatsuInfo>`SELECT 
    s.post_id, s.name, s.title, s.explain, s.image_url, s.lat, s.lng, s.address, s.time, s.menu,
    us.scrap_id, s.image_urls, s.table_id,
    CASE WHEN us.scrap_id IS NOT NULL THEN 1 ELSE 0 END AS is_scrap,
    COALESCE(scrap_count.scrap_count, 0) AS scrap_count
    FROM 
        katsu_info s
    LEFT JOIN 
        scraps us ON s.post_id = us.post_id AND us.user_email = ${userEmail}
    LEFT JOIN 
        (
            SELECT 
                post_id, 
                COUNT(scrap_id) AS scrap_count
            FROM 
                scraps
            GROUP BY 
                post_id
        ) scrap_count ON s.post_id = scrap_count.post_id
    ORDER BY scrap_count DESC`;
      return NextResponse.json(data.rows);
    } else {
      const data = await sql<KatsuInfo>`SELECT 
    s.post_id, s.name, s.title, s.explain, s.image_url, s.lat, s.lng, s.address, s.time, s.menu,
    us.scrap_id, s.image_urls, s.table_id,
    CASE WHEN us.scrap_id IS NOT NULL THEN 1 ELSE 0 END AS is_scrap,
    COALESCE(scrap_count.scrap_count, 0) AS scrap_count
    FROM 
        katsu_info s
    LEFT JOIN 
        scraps us ON s.post_id = us.post_id AND us.user_email = ${userEmail}
    LEFT JOIN 
        (
            SELECT 
                post_id, 
                COUNT(scrap_id) AS scrap_count
            FROM 
                scraps
            GROUP BY 
                post_id
        ) scrap_count ON s.post_id = scrap_count.post_id
    ORDER BY post_id DESC`;
      return NextResponse.json(data.rows);
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
