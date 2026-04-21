import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import clientPromise, { DATABASE_NAME, getDatabase } from "@/lib/mongodb";

type GoogleProfile = {
  email?: string;
  name?: string;
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

type AuthAccountDocument = {
  _id?: unknown;
  userId: ObjectId;
  provider: string;
  providerAccountId: string;
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
      const normalizedEmail = (googleProfile?.email ?? user.email)?.toLowerCase();
      if (!normalizedEmail) {
        return true;
      }

      const db = await getDatabase();
      const providers = account?.provider ? [account.provider] : [];
      const now = new Date();

      await db.collection<AuthUserDocument>("users").updateOne(
        { email: normalizedEmail },
        {
          $set: {
            email: normalizedEmail,
            name: googleProfile?.name ?? user.name ?? null,
            image:
              user.image ??
              (typeof googleProfile?.picture === "string"
                ? googleProfile.picture
                : null),
            updatedAt: now,
          },
          $addToSet: {
            authProviders: { $each: providers },
          },
          $setOnInsert: {
            createdAt: now,
            emailVerified: null,
          },
        },
        { upsert: true },
      );

      if (account?.provider === "google" && account.providerAccountId) {
        const targetUser = await db.collection<AuthUserDocument>("users").findOne(
          { email: normalizedEmail },
          { projection: { _id: 1 } },
        );

        if (targetUser?._id) {
          const targetUserId = String(targetUser._id);

          await db.collection<AuthAccountDocument>("accounts").updateOne(
            {
              provider: "google",
              providerAccountId: account.providerAccountId,
            },
            {
              $set: {
                userId: new ObjectId(targetUserId),
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state:
                  typeof account.session_state === "string"
                    ? account.session_state
                    : undefined,
              },
            },
            { upsert: true },
          );

          user.id = targetUserId;
          user.email = normalizedEmail;
          user.name = googleProfile?.name ?? user.name ?? null;
          user.image =
            user.image ??
            (typeof googleProfile?.picture === "string"
              ? googleProfile.picture
              : null);
          user.authProviders = Array.from(new Set([...(user.authProviders ?? []), "google"]));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.id = user.id;
        token.email = user.email ?? null;
        token.name = user.name ?? null;
        token.picture = user.image ?? null;
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
        session.user.name = token.name ?? session.user.name ?? null;
        session.user.email = token.email ?? session.user.email ?? null;
        session.user.image = typeof token.picture === "string" ? token.picture : null;
        session.user.authProviders = token.authProviders ?? [];
      }

      return session;
    },
  },
};
