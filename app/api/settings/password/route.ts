import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { updateSettingsPasswordSchema } from "@/lib/auth-schema";
import { getDatabase } from "@/lib/mongodb";

type SettingsPasswordUserDocument = {
  email: string;
  passwordHash?: string;
  authProviders?: string[];
  updatedAt?: Date;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateSettingsPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection<SettingsPasswordUserDocument>("users");
    const user = await usersCollection.findOne(
      { email: session.user.email.toLowerCase() },
      {
        projection: {
          email: 1,
          passwordHash: 1,
          authProviders: 1,
        },
      },
    );

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    if (user.passwordHash) {
      const isValidPassword = await bcrypt.compare(
        parsed.data.currentPassword,
        user.passwordHash,
      );

      if (!isValidPassword) {
        return NextResponse.json(
          {
            message: "Current password is incorrect.",
            errors: {
              currentPassword: ["Current password is incorrect."],
            },
          },
          { status: 400 },
        );
      }
    }

    const nextPasswordHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await usersCollection.updateOne(
      { email: session.user.email.toLowerCase() },
      {
        $set: {
          passwordHash: nextPasswordHash,
          updatedAt: new Date(),
        },
        $addToSet: {
          authProviders: "credentials",
        },
      },
    );

    return NextResponse.json({
      message: "Password updated successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update password." },
      { status: 500 },
    );
  }
}
