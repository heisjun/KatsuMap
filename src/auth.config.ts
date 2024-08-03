import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
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
      const isOnDashboard =
        nextUrl.pathname.startsWith("/content/post") ||
        nextUrl.pathname.startsWith("/myfeed");

      //인가가 필요한 경로이동
      if (isOnDashboard) {
        //+ 로그인을 했다면
        if (isLoggedIn) return true;
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/loginform`
        ); // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log("로그인 완료했다.");
      }

      return true;
    },
  },

  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
