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
  updatedAt: Date;
};

type RouteContext = {
  params: Promise<{
    policyId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { policyId } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      description?: string;
      trigger?: string;
      action?: string;
    };

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const trigger = typeof body.trigger === "string" ? body.trigger.trim() : "";
    const action = typeof body.action === "string" ? body.action.trim() : "";

    if (!title || !description || !trigger || !action) {
      return NextResponse.json({ message: "All policy fields are required." }, { status: 400 });
    }

    const db = await getDatabase();
    const normalizedEmail = session.user.email.toLowerCase();
    const existing = await db.collection<AlertPolicyDocument>("alert_policies").findOne({
      userEmail: normalizedEmail,
    });

    if (!existing) {
      return NextResponse.json({ message: "Alert policy configuration not found." }, { status: 404 });
    }

    const nextPolicies = existing.policies.map((policy) =>
      policy.id === policyId
        ? {
            ...policy,
            title,
            description,
            trigger,
            action,
          }
        : policy,
    );

    const updatedPolicy = nextPolicies.find((policy) => policy.id === policyId);
    if (!updatedPolicy) {
      return NextResponse.json({ message: "Alert policy not found." }, { status: 404 });
    }

    const now = new Date();
    await db.collection<AlertPolicyDocument>("alert_policies").updateOne(
      { userEmail: normalizedEmail },
      {
        $set: {
          policies: nextPolicies,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json({
      message: "Alert policy updated successfully.",
      policy: updatedPolicy,
    });
  } catch {
    return NextResponse.json({ message: "Failed to update alert policy." }, { status: 500 });
  }
}
