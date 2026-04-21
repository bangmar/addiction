import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { updateSettingsProfileSchema } from "@/lib/auth-schema";

type SettingsUserDocument = {
  _id?: unknown;
  name?: string | null;
  email: string;
  image?: string | null;
  authProviders?: string[];
  preferredLanguage?: string | null;
  updatedAt?: Date;
  createdAt?: Date;
};

type SettingsLoginLogItem = {
  title: string;
  timestamp: string;
  device: "All devices" | "Web dashboard" | "Desktop app" | "Mobile app";
  location: string;
  accentClassName: string;
};

function toReadableTimestamp(value?: Date) {
  if (!value) {
    return "No recent updates";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function buildLoginLogs(user: SettingsUserDocument): SettingsLoginLogItem[] {
  const providers = user.authProviders ?? [];
  const updatedAt = user.updatedAt ?? user.createdAt;
  const logs: SettingsLoginLogItem[] = [
    {
      title: "Web dashboard login",
      timestamp: toReadableTimestamp(updatedAt),
      device: "Web dashboard",
      location: "Authenticated web session",
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
  ];

  if (providers.includes("google")) {
    logs.push({
      title: "Google account connected",
      timestamp: toReadableTimestamp(updatedAt),
      device: "Web dashboard",
      location: "Google OAuth provider",
      accentClassName: "bg-sky-500/10 text-sky-700",
    });
  }

  if (providers.includes("credentials")) {
    logs.push({
      title: "Credentials login enabled",
      timestamp: toReadableTimestamp(updatedAt),
      device: "Web dashboard",
      location: "Email and password access",
      accentClassName: "bg-violet-500/10 text-violet-700",
    });
  }

  return logs;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const db = await getDatabase();
  const user = await db.collection<SettingsUserDocument>("users").findOne(
    { email: session.user.email.toLowerCase() },
    {
      projection: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        authProviders: 1,
        preferredLanguage: 1,
        updatedAt: 1,
        createdAt: 1,
      },
    },
  );

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    profile: {
      name: user.name ?? session.user.name ?? "",
      email: user.email,
      preferredLanguage: user.preferredLanguage ?? "id",
      updatedAt: user.updatedAt?.toISOString() ?? user.createdAt?.toISOString() ?? null,
      authProviders: user.authProviders ?? [],
    },
    loginLogs: buildLoginLogs(user),
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = updateSettingsProfileSchema.safeParse(body);

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
    const now = new Date();

    await db.collection<SettingsUserDocument>("users").updateOne(
      { email: session.user.email.toLowerCase() },
      {
        $set: {
          name: parsed.data.name,
          preferredLanguage: parsed.data.preferredLanguage,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json({
      message: "Settings updated successfully.",
      profile: {
        name: parsed.data.name,
        email: session.user.email,
        preferredLanguage: parsed.data.preferredLanguage,
        updatedAt: now.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update settings." },
      { status: 500 },
    );
  }
}
