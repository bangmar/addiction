import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

type AlertPolicyDocument = {
  userEmail: string;
  policies: Array<{
    id: string;
    title: string;
    description: string;
    trigger: string;
    action: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

const defaultPolicies: AlertPolicyDocument["policies"] = [
  {
    id: "budget-reached-notification",
    title: "Budget reached notification",
    description: "Kirim toast notification saat moderate-mode budget habis.",
    trigger: "When daily budget = 100%",
    action: "Windows toast + persist alert in dashboard",
  },
  {
    id: "abstinence-violation",
    title: "Abstinence violation",
    description: "Tandai critical incident saat executable/domain terdeteksi pada mode abstinence.",
    trigger: "Any zero-tolerance detection",
    action: "Immediate alert + review incident flow",
  },
  {
    id: "sync-fallback",
    title: "Sync fallback",
    description: "Simpan event lokal bila cloud sync terlambat, lalu kirim ulang saat koneksi pulih.",
    trigger: "Sync delayed more than 60 sec",
    action: "Queue local events + retry in background",
  },
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const normalizedEmail = session.user.email.toLowerCase();
    const existing = await db.collection<AlertPolicyDocument>("alert_policies").findOne(
      { userEmail: normalizedEmail },
      { projection: { _id: 0, policies: 1 } },
    );

    if (existing?.policies?.length) {
      return NextResponse.json({ policies: existing.policies });
    }

    const now = new Date();
    await db.collection<AlertPolicyDocument>("alert_policies").updateOne(
      { userEmail: normalizedEmail },
      {
        $set: {
          userEmail: normalizedEmail,
          policies: defaultPolicies,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ policies: defaultPolicies });
  } catch {
    return NextResponse.json({ message: "Failed to load alert policies." }, { status: 500 });
  }
}
