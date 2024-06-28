import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { z } from "zod";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
async function createUser(
  email: string,
  name: string,
  id: string,
  image: string | null,
  provider: string
) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, id, image, provider)
      VALUES (${email}, ${name},${id},${image},${provider})
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUserByEmail(email);

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return null;
        }

        return user;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider !== "Credentials") {
        const existingUser = await getUserByEmail(user.email as string);
        if (!existingUser) {
          const newUser = await createUser(
            user.email as string,
            user.name as string,
            user.id as string,
            user.image!,
            account?.provider!
          );
          if (newUser) {
            user.id = newUser.id;
          } else {
            return false;
          }
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
});
