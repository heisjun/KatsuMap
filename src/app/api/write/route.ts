import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 데이터 가져오기
    const {
      post_id,
      name,
      title,
      explain,
      image_url,
      image_urls,
      lat,
      lng,
      time,
      menu,
      address,
      table_id,
    } = await request.json();

    const imageUrlsJson = JSON.stringify(image_urls);

    // PostgreSQL에 데이터 삽입
    const result = await sql`
      INSERT INTO katsu_info (post_id, name, title, explain, image_url, image_urls, lat, lng, time, menu, address,table_id)
        VALUES (${post_id}, ${name}, ${title},${explain},${image_url}, ${imageUrlsJson},${lat},${lng},${time},${menu},${address},${table_id})
        ON CONFLICT (post_id) DO NOTHING;
    `;

    // 삽입된 데이터 반환
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
