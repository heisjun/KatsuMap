import { KatsuInfo } from "@/app/_lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  noStore();
  try {
    const data =
      await sql<KatsuInfo>`SELECT * FROM katsu_info where post_id = ${params.postId}`;

    return NextResponse.json(data.rows[0]);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
