import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

type HabitDocument = {
  _id?: ObjectId;
  userEmail: string;
};

type RouteContext = {
  params: Promise<{
    habitId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { habitId } = await context.params;
  if (!ObjectId.isValid(habitId)) {
    return NextResponse.json({ message: "Invalid habit id." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const result = await db.collection<HabitDocument>("habits").deleteOne({
      _id: new ObjectId(habitId),
      userEmail: session.user.email.toLowerCase(),
    });

    if (!result.deletedCount) {
      return NextResponse.json({ message: "Habit not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Habit deleted successfully." });
  } catch {
    return NextResponse.json({ message: "Failed to delete habit." }, { status: 500 });
  }
}
