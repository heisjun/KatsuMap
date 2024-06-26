// app/api/users/route.js
import { NextResponse, NextRequest } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 데이터 가져오기
    const { scrapId, user_email, postId } = await request.json();

    // PostgreSQL에 데이터 삽입
    const result = await sql`
      INSERT INTO scraps (scrap_id, user_email,post_id)
      VALUES (${scrapId},${user_email},${postId})
      RETURNING *
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

export async function DELETE(request: NextRequest) {
  const { unScrapId } = await request.json();
  await sql`
      DELETE FROM scraps
      WHERE scrap_id = ${unScrapId}
    `;
  return new Response(null, { status: 204 });
}
