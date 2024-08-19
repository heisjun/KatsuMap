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
    const data = await sql<KatsuInfo>`SELECT name FROM users where 	
email = ${params.userId}`;

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
