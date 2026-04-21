import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

type DesktopAuthRequestDocument = {
  status: "pending" | "approved" | "rejected" | "expired";
  approvedByUserId?: string;
  approvedByEmail?: string;
  desktopAuthToken?: string;
  expiresAt: Date;
};

type DesktopAgentStatusDocument = {
  userId?: string | null;
  userEmail: string;
  isMonitoring: boolean;
  watchedRulesCount: number;
  lastSyncAt: string | null;
  lastSeenAt: Date;
  activeWindow: {
    title: string;
    application: string;
    ownerName: string;
    url?: string;
  } | null;
  updatedAt: Date;
};

async function authorizeDesktopRequest(request: Request) {
  const authorizationHeader = request.headers.get("authorization") ?? "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length).trim()
    : "";

  if (!token) {
    return null;
  }

  const db = await getDatabase();
  const authRequest = await db.collection<DesktopAuthRequestDocument>("desktop_auth_requests").findOne(
    {
      desktopAuthToken: token,
      status: "approved",
    },
    {
      projection: {
        approvedByUserId: 1,
        approvedByEmail: 1,
        expiresAt: 1,
      },
    },
  );

  if (!authRequest?.approvedByEmail) {
    return null;
  }

  if (authRequest.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return authRequest;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const desktopAuth = await authorizeDesktopRequest(request);
    const resolvedEmail = session?.user?.email?.toLowerCase() ?? desktopAuth?.approvedByEmail?.toLowerCase() ?? null;

    if (!resolvedEmail) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const db = await getDatabase();
    const status = await db.collection<DesktopAgentStatusDocument>("desktop_agent_status").findOne(
      {
        userEmail: resolvedEmail,
      },
      {
        projection: {
          _id: 0,
          isMonitoring: 1,
          watchedRulesCount: 1,
          lastSyncAt: 1,
          lastSeenAt: 1,
          activeWindow: 1,
        },
      },
    );

    return NextResponse.json({ status: status ?? null });
  } catch {
    return NextResponse.json({ message: "Failed to load desktop status." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authRequest = await authorizeDesktopRequest(request);
    if (!authRequest?.approvedByEmail) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      isMonitoring?: boolean;
      watchedRulesCount?: number;
      lastSyncAt?: string | null;
      activeWindow?: DesktopAgentStatusDocument["activeWindow"];
    };

    const db = await getDatabase();
    const now = new Date();

    await db.collection<DesktopAgentStatusDocument>("desktop_agent_status").updateOne(
      {
        userEmail: authRequest.approvedByEmail.toLowerCase(),
      },
      {
        $set: {
          userId: authRequest.approvedByUserId ?? null,
          userEmail: authRequest.approvedByEmail.toLowerCase(),
          isMonitoring: Boolean(body.isMonitoring),
          watchedRulesCount: Number.isFinite(body.watchedRulesCount) ? Number(body.watchedRulesCount) : 0,
          lastSyncAt: typeof body.lastSyncAt === "string" || body.lastSyncAt === null ? body.lastSyncAt : null,
          activeWindow: body.activeWindow ?? null,
          lastSeenAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ message: "Desktop status updated." });
  } catch {
    return NextResponse.json({ message: "Failed to update desktop status." }, { status: 500 });
  }
}
