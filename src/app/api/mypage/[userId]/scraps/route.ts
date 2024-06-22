import { KatsuInfo } from "@/app/_lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data =
      await sql<KatsuInfo>`SELECT s.post_id, s.name, s.title, s.explain, s.image_url, s.lat, s.lng, s.address, s.time, s.menu,
      us.scrap_id, 
      CASE WHEN us.scrap_id IS NOT NULL THEN 1 ELSE 0 END AS is_scrap
			FROM katsu_info s
			JOIN scraps us ON s.post_id = us.post_id and us.user_email =${params.userId}`;

    // console.log('Data fetch completed after 3 seconds.');

    return NextResponse.json(data.rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
