import { randomUUID } from "node:crypto";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
  desktopAuthDecisionSchema,
  desktopAuthRequestParamsSchema,
} from "@/lib/desktop-auth-schema";
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

export async function POST(request: Request, context: { params: Promise<{ requestId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const rawParams = await context.params;
  const parsedParams = desktopAuthRequestParamsSchema.safeParse(rawParams);
  const body = await request.json().catch(() => ({}));
  const parsedBody = desktopAuthDecisionSchema.safeParse(body);

  if (!parsedParams.success || !parsedBody.success) {
    return NextResponse.json({ message: "Invalid desktop auth decision." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<DesktopAuthRequestDocument>("desktop_auth_requests");
    const authRequest = await collection.findOne({
      requestId: parsedParams.data.requestId,
      code: parsedBody.data.code,
    });

    if (!authRequest) {
      return NextResponse.json({ message: "Desktop auth request not found." }, { status: 404 });
    }

    if (authRequest.expiresAt.getTime() <= Date.now()) {
      await collection.updateOne(
        { requestId: authRequest.requestId },
        { $set: { status: "expired", updatedAt: new Date() } },
      );
      return NextResponse.json({ message: "Desktop auth request expired." }, { status: 410 });
    }

    const now = new Date();
    const nextStatus = parsedBody.data.decision === "allow" ? "approved" : "rejected";

    await collection.updateOne(
      { requestId: authRequest.requestId },
      {
        $set: {
          status: nextStatus,
          updatedAt: now,
          approvedByUserId: parsedBody.data.decision === "allow" ? session.user.id : undefined,
          approvedByEmail: session.user.email,
          desktopAuthToken: parsedBody.data.decision === "allow" ? randomUUID() : undefined,
          approvedAt: parsedBody.data.decision === "allow" ? now : undefined,
          rejectedAt: parsedBody.data.decision === "deny" ? now : undefined,
        },
      },
    );

    return NextResponse.json({
      message: nextStatus === "approved" ? "Desktop login approved." : "Desktop login denied.",
      status: nextStatus,
      redirectUrl: `/portal/confirmed?status=${encodeURIComponent(nextStatus)}`,
    });
  } catch {
    return NextResponse.json({ message: "Failed to process desktop auth decision." }, { status: 500 });
  }
}
