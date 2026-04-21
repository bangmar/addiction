import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

type AlertDocument = {
  _id?: ObjectId;
  userEmail: string;
  reviewNotes: string | null;
  reviewed: boolean;
  reviewedAt: Date | null;
  updatedAt: Date;
};

type RouteContext = {
  params: Promise<{
    alertId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { alertId } = await context.params;

  if (!ObjectId.isValid(alertId)) {
    return NextResponse.json({ message: "Invalid alert id." }, { status: 400 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      notes?: string;
    };
    const notes = typeof body.notes === "string" ? body.notes.trim() : "";

    if (!notes) {
      return NextResponse.json({ message: "Review notes are required." }, { status: 400 });
    }

    const db = await getDatabase();
    const now = new Date();
    const result = await db.collection<AlertDocument>("alerts").findOneAndUpdate(
      {
        _id: new ObjectId(alertId),
        userEmail: session.user.email.toLowerCase(),
      },
      {
        $set: {
          reviewNotes: notes,
          reviewed: true,
          reviewedAt: now,
          updatedAt: now,
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!result) {
      return NextResponse.json({ message: "Alert not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Incident reviewed successfully.",
      alert: {
        id: String(result._id),
        reviewed: result.reviewed,
        reviewNotes: result.reviewNotes,
        reviewedAt: result.reviewedAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to review alert." }, { status: 500 });
  }
}
