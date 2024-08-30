import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface RequestParams {
  params: {
    userId: string;
  };
}

interface UserProfileUpdate {
  nickname: string;
  image: string;
}

export async function PUT(request: Request, { params }: RequestParams) {
  try {
    const { nickname, image }: UserProfileUpdate = await request.json();

    if (!nickname || !image) {
      return NextResponse.json(
        { error: "Nickname and image are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE users 
      SET nickname = ${nickname}, image = ${image} 
      WHERE email = ${params.userId}`;

    if (result.rowCount > 0) {
      return NextResponse.json({ message: "Profile updated successfully" });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
