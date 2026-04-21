import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { createDesktopAuthRequestSchema } from "@/lib/desktop-auth-schema";
import { getDatabase } from "@/lib/mongodb";

type DesktopAuthRequestDocument = {
  requestId: string;
  code: string;
  status: "pending" | "approved" | "rejected" | "expired";
  emailHint?: string;
  deviceLabel?: string;
  approvedByUserId?: string;
  approvedByEmail?: string;
  desktopAuthToken?: string;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
};

function createCode() {
  return Math.random().toString().slice(2, 8);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = createDesktopAuthRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const requestId = randomUUID();
    const code = createCode();

    const document: DesktopAuthRequestDocument = {
      requestId,
      code,
      status: "pending",
      emailHint: parsed.data.emailHint,
      deviceLabel: parsed.data.deviceLabel ?? "Habit Tracker Desktop",
      createdAt: now,
      updatedAt: now,
      expiresAt,
    };

    const db = await getDatabase();
    await db.collection<DesktopAuthRequestDocument>("desktop_auth_requests").insertOne(document);

    return NextResponse.json({
      message: "Desktop auth request created.",
      requestId,
      code,
      expiresAt: expiresAt.toISOString(),
      confirmationUrl: `/portal/confirmation?requestId=${encodeURIComponent(requestId)}&code=${encodeURIComponent(code)}`,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create desktop auth request." }, { status: 500 });
  }
}
