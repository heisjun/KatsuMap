import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { sql } from "@vercel/postgres";
import type { User } from "@/app/_lib/definitions";
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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token }) {
      //console.log("auth.ts jwt", token);
      return token;
    },
    session({ session, newSession, user }) {
      //console.log("auth.ts session", session, newSession, user);
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/content/post");

      //console.log("nextUrl", nextUrl);
      //console.log("isLoggedIn", isLoggedIn);
      //console.log("isOnDashboard", isOnDashboard);

      //post로 시작한다면
      if (isOnDashboard) {
        //+ 로그인을 했다면
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log("로그인 완료했다.");
        return true;
      }

      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          //console.log('user', user)
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          //전부 다 확인같이 해보아요.
          //console.log('passwordsMatch', passwordsMatch)
          //console.log('password', password)
          //console.log('user.password', user.password)

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
