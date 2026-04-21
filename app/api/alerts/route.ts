import type { ObjectId } from "mongodb";
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

type AlertSeverity = "Critical" | "High" | "Medium";
type AlertSource = "desktop-notification" | "manual-test";

type AlertDocument = {
  _id?: ObjectId;
  userId?: string | null;
  userEmail: string;
  title: string;
  category: string;
  timestampLabel: string;
  severity: AlertSeverity;
  message: string;
  resolution: string;
  source: AlertSource;
  deliveryStatus: "sent" | "pending" | "failed";
  reviewed: boolean;
  reviewNotes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
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

function formatTimestampLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const alerts = await db
      .collection<AlertDocument>("alerts")
      .find(
        { userEmail: session.user.email.toLowerCase() },
        {
          projection: {
            _id: 1,
            title: 1,
            category: 1,
            timestampLabel: 1,
            severity: 1,
            message: 1,
            resolution: 1,
            source: 1,
            deliveryStatus: 1,
            reviewed: 1,
            reviewNotes: 1,
            reviewedAt: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    return NextResponse.json({
      alerts: alerts.map((alert) => ({
        id: String(alert._id),
        title: alert.title,
        category: alert.category,
        timestamp: alert.timestampLabel,
        severity: alert.severity,
        message: alert.message,
        resolution: alert.resolution,
        source: alert.source,
        deliveryStatus: alert.deliveryStatus,
        reviewed: alert.reviewed,
        reviewNotes: alert.reviewNotes,
        reviewedAt: alert.reviewedAt,
        createdAt: alert.createdAt,
        updatedAt: alert.updatedAt,
      })),
    });
  } catch {
    return NextResponse.json({ message: "Failed to load alerts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const desktopAuth = await authorizeDesktopRequest(request);
  const session = desktopAuth ? null : await getServerSession(authOptions);
  const resolvedEmail = session?.user?.email?.toLowerCase() ?? desktopAuth?.approvedByEmail?.toLowerCase() ?? null;

  if (!resolvedEmail) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Partial<{
      title: string;
      category: string;
      severity: AlertSeverity;
      message: string;
      resolution: string;
      source: AlertSource;
      deliveryStatus: "sent" | "pending" | "failed";
      timestamp: string;
    }>;

    if (!body.title || !body.category || !body.message || !body.resolution) {
      return NextResponse.json({ message: "Validation failed." }, { status: 400 });
    }

    const now = body.timestamp ? new Date(body.timestamp) : new Date();
    const safeNow = Number.isNaN(now.getTime()) ? new Date() : now;
    const db = await getDatabase();
    const document: AlertDocument = {
      userId: session?.user?.id ?? desktopAuth?.approvedByUserId ?? null,
      userEmail: resolvedEmail,
      title: body.title.trim(),
      category: body.category.trim(),
      timestampLabel: formatTimestampLabel(safeNow),
      severity: body.severity === "Critical" || body.severity === "High" ? body.severity : "Medium",
      message: body.message.trim(),
      resolution: body.resolution.trim(),
      source: body.source === "manual-test" ? "manual-test" : "desktop-notification",
      deliveryStatus: body.deliveryStatus === "failed" || body.deliveryStatus === "pending" ? body.deliveryStatus : "sent",
      reviewed: false,
      reviewNotes: null,
      reviewedAt: null,
      createdAt: safeNow,
      updatedAt: safeNow,
    };

    const result = await db.collection<AlertDocument>("alerts").insertOne(document);

    return NextResponse.json(
      {
        message: "Alert created successfully.",
        alert: {
          id: String(result.insertedId),
          title: document.title,
          category: document.category,
          timestamp: document.timestampLabel,
          severity: document.severity,
          message: document.message,
          resolution: document.resolution,
          source: document.source,
          deliveryStatus: document.deliveryStatus,
          reviewed: document.reviewed,
          reviewNotes: document.reviewNotes,
          reviewedAt: document.reviewedAt,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ message: "Failed to create alert." }, { status: 500 });
  }
}
