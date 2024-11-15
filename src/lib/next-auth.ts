import {
  AuthOptions,
  getServerSession as nextAuthGetServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { compareHash } from "@/utils/encryption";

import type { DefaultJWT } from "next-auth/jwt";

import prisma from "./prisma";
import { Role } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
      name: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    name: string;
    email: string;
  }
}

export const authOptions: AuthOptions = {
  theme: {
    colorScheme: "dark",
    brandColor: "#E04E4E",
    logo: "/logo.png",
  },
  session: {
    strategy: "jwt",
  },
  pages: { signIn: "/auth/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@student.smktelkom-mlg.sch.id",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
          if (!user?.password) return null;

          const isPasswordCorrect = compareHash(
            credentials?.password as string,
            user.password,
          );

          if (!isPasswordCorrect) return null;

          const userPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };

          return userPayload;
        } catch (e) {
          console.error("Authorization Error:", e);
          return null;
        }
      },
    }),
    // TODO: Work on Google sign-in provider
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: false,
    // }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
    },
    async signIn({ user }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        try {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split("@")[0],
              role: "CUSTOMER",
              is_verified: true,
            },
          });
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) return token;

        token.id = existingUser.id;
        token.role = existingUser?.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        const findUser = await prisma.user.findUnique({
          where: { id: token.id },
        });
        session.user.role = findUser?.role || "CUSTOMER";
        session.user.name = findUser?.name as string;
        session.user.email = findUser?.email as string;
        session.user.id = findUser?.id as string;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerSession = () => nextAuthGetServerSession(authOptions);
