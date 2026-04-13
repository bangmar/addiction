import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import clientPromise, { DATABASE_NAME, getDatabase } from "@/lib/mongodb";

type GoogleProfile = {
  picture?: string;
};

type AuthUserDocument = {
  _id?: unknown;
  name?: string | null;
  email: string;
  image?: string | null;
  passwordHash?: string;
  authProviders?: string[];
};

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: DATABASE_NAME }),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/portal",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const db = await getDatabase();
        const user = await db.collection<AuthUserDocument>("users").findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: String(user._id),
          name: user.name ?? null,
          email: user.email,
          image: typeof user.image === "string" ? user.image : null,
          authProviders: user.authProviders ?? ["credentials"],
        };
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const googleProfile = profile as GoogleProfile | undefined;
      if (!user.email) {
        return true;
      }

      const db = await getDatabase();
      const providers = account?.provider ? [account.provider] : [];

      await db.collection("users").updateOne(
        { email: user.email.toLowerCase() },
        {
          $set: {
            email: user.email.toLowerCase(),
            name: user.name ?? null,
            image:
              user.image ??
              (typeof googleProfile?.picture === "string"
                ? googleProfile.picture
                : null),
            updatedAt: new Date(),
          },
          $addToSet: {
            authProviders: { $each: providers },
          },
          $setOnInsert: {
            createdAt: new Date(),
            emailVerified: null,
          },
        },
        { upsert: true },
      );

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.authProviders = user.authProviders ?? [];
      }

      if ((!token.authProviders || token.authProviders.length === 0) && token.email) {
        const db = await getDatabase();
        const dbUser = await db.collection<AuthUserDocument>("users").findOne(
          { email: token.email.toLowerCase() },
          { projection: { authProviders: 1 } },
        );

        token.authProviders = dbUser?.authProviders ?? [];
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub;
        session.user.authProviders = token.authProviders ?? [];
      }

      return session;
    },
  },
};
