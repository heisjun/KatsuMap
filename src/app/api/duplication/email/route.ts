import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { IUser } from "@/model/User";

async function getUser(email: string): Promise<IUser> {
  try {
    const user = await sql<IUser>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

function convertProvider(provider: string | null) {
  if (provider === null) {
    return "katsumap으";
  } else if (provider === "kakao") {
    return "카카오 간편가입으";
  } else if (provider === "naver") {
    return "네이버 간편가입으";
  } else {
    return "알 수 없음";
  }
}

// POST 함수 정의
export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const user = await getUser(email);

  // 이미 가입되어 있는 계정이면 오류 메시지를 응답으로 전달
  if (user) {
    // 사용자가 존재하면 provider 정보를 반환
    return NextResponse.json(convertProvider(user.provider));
  } else {
    // 사용자가 존재하지 않으면 null 반환
    return NextResponse.json(null);
  }
}
