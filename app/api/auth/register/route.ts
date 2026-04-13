import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/auth-schema";
import { getDatabase } from "@/lib/mongodb";

type RegisterRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

type RegisterUserDocument = {
  _id?: unknown;
  name?: string | null;
  email: string;
  passwordHash?: string;
  image?: string | null;
  authProviders?: string[];
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const db = await getDatabase();
    const usersCollection = db.collection<RegisterUserDocument & {
      email: string;
      passwordHash?: string;
      authProviders?: string[];
    }>("users");

    const existingUser = await usersCollection.findOne(
      { email },
      {
        projection: {
          _id: 1,
          passwordHash: 1,
          authProviders: 1,
        },
      },
    );

    if (existingUser?.passwordHash) {
      return NextResponse.json(
        {
          message: "Email already registered. Please log in instead.",
          errors: {
            email: ["Email already registered."],
          },
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    if (existingUser) {
      await usersCollection.updateOne(
        { email },
        {
          $set: {
            name,
            passwordHash,
            updatedAt: now,
          },
          $addToSet: {
            authProviders: "credentials",
          },
        },
      );

      return NextResponse.json({
        message: "Registration successful.",
        userId: String(existingUser._id),
      });
    }

    const result = await usersCollection.insertOne({
      name,
      email,
      passwordHash,
      image: null,
      authProviders: ["credentials"],
      emailVerified: null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        message: "Registration successful.",
        userId: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Registration failed. Please try again.",
      },
      { status: 500 },
    );
  }
}
