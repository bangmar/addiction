import type { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { getDatabase } from "@/lib/mongodb";

type DesktopAuthRequestDocument = {
  requestId: string;
  code: string;
  status: "pending" | "approved" | "rejected" | "expired";
  approvedByUserId?: string;
  approvedByEmail?: string;
  desktopAuthToken?: string;
  expiresAt: Date;
};

type HabitDocument = {
  _id?: ObjectId;
  userEmail: string;
  userId?: string;
  name: string;
  mode: "Moderate" | "Abstinence";
  budget: string | null;
  domains: string[];
  executables: string[];
};

function parseBudgetMinutes(value: string | null) {
  if (!value) {
    return undefined;
  }

  const matchedValue = value.match(/\d+/);
  if (!matchedValue) {
    return undefined;
  }

  return Number.parseInt(matchedValue[0], 10);
}

export async function GET(request: Request) {
  const authorizationHeader = request.headers.get("authorization") ?? "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length).trim()
    : "";

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
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
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (authRequest.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json({ message: "Desktop token expired." }, { status: 401 });
    }

    const habits = await db
      .collection<HabitDocument>("habits")
      .find(
        {
          userEmail: authRequest.approvedByEmail.toLowerCase(),
        },
        {
          projection: {
            _id: 1,
            name: 1,
            mode: 1,
            budget: 1,
            domains: 1,
            executables: 1,
          },
        },
      )
      .toArray();

    const rules = habits.map((habit) => ({
      id: String(habit._id),
      name: habit.name,
      mode: habit.mode,
      budgetMinutes: habit.mode === "Moderate" ? parseBudgetMinutes(habit.budget) : undefined,
      domains: habit.domains,
      executables: habit.executables,
    }));

    return NextResponse.json({ rules });
  } catch {
    return NextResponse.json({ message: "Failed to load desktop rules." }, { status: 500 });
  }
}
