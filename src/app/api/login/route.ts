import { User } from "@/app/_lib/definitions";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const user = await getUser(body.username);

  // 유저가 없을때는 null을 반환한다. 유저가 있을때 password제외한 값 리턴
  if (user) {
    // userWithoutPass : username
    const { password, ...userWithoutPass } = user;
    return new Response(JSON.stringify(userWithoutPass));
  } else return new Response(JSON.stringify(null));
}
