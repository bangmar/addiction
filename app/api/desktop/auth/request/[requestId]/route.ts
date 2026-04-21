import { NextResponse } from "next/server";

import {
  desktopAuthRequestParamsSchema,
  desktopAuthStatusQuerySchema,
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

export async function GET(request: Request, context: { params: Promise<{ requestId: string }> }) {
  const rawParams = await context.params;
  const parsedParams = desktopAuthRequestParamsSchema.safeParse(rawParams);
  const parsedQuery = desktopAuthStatusQuerySchema.safeParse({
    code: new URL(request.url).searchParams.get("code") ?? "",
  });

  if (!parsedParams.success || !parsedQuery.success) {
    return NextResponse.json({ message: "Invalid desktop auth request." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const authRequest = await db.collection<DesktopAuthRequestDocument>("desktop_auth_requests").findOne({
      requestId: parsedParams.data.requestId,
      code: parsedQuery.data.code,
    });

    if (!authRequest) {
      return NextResponse.json({ message: "Desktop auth request not found." }, { status: 404 });
    }

    if (authRequest.status === "pending" && authRequest.expiresAt.getTime() <= Date.now()) {
      await db.collection<DesktopAuthRequestDocument>("desktop_auth_requests").updateOne(
        { requestId: authRequest.requestId },
        { $set: { status: "expired", updatedAt: new Date() } },
      );
      authRequest.status = "expired";
    }

    return NextResponse.json({
      requestId: authRequest.requestId,
      status: authRequest.status,
      emailHint: authRequest.emailHint ?? null,
      approvedByEmail: authRequest.approvedByEmail ?? null,
      userId: authRequest.approvedByUserId ?? null,
      desktopAuthToken: authRequest.desktopAuthToken ?? null,
      expiresAt: authRequest.expiresAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ message: "Failed to read desktop auth request." }, { status: 500 });
  }
}
