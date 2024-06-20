import type { NextAuthConfig } from "next-auth";

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
      const isOnDashboard = nextUrl.pathname.startsWith("/content/post");

      //console.log("nextUrl", nextUrl)
      //console.log("isLoggedIn", isLoggedIn)
      //console.log("isOnDashboard", isOnDashboard)

      //post로 시작한다면
      if (isOnDashboard) {
        //+ 로그인을 했다면
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log("로그인 완료했다.");
      }

      return true;
    },
  },

  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
