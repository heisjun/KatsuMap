import { IStore } from "@/model/Store";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");

  noStore();
  try {
    const data =
      await sql<IStore>`SELECT * FROM katsu_info WHERE name = ${name}`;

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
