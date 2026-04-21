import type { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { createHabitSchema } from "@/lib/habit-schema";
import { getDatabase } from "@/lib/mongodb";

type HabitDocument = {
  _id?: ObjectId;
  userEmail: string;
  userId?: string;
  name: string;
  category: string;
  categoryId: string;
  prompt: string;
  mode: "Moderate" | "Abstinence";
  budget: string | null;
  schedule: string;
  domains: string[];
  executables: string[];
  streak: number;
  progress: number;
  todayUsageMinutes: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = await getDatabase();
    const habits = await db
      .collection<HabitDocument>("habits")
      .find(
        { userEmail: session.user.email.toLowerCase() },
        {
          projection: {
            _id: 1,
            name: 1,
            category: 1,
            categoryId: 1,
            prompt: 1,
            mode: 1,
            budget: 1,
            schedule: 1,
            domains: 1,
            executables: 1,
            streak: 1,
            progress: 1,
            todayUsageMinutes: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      habits: habits.map((habit) => ({
        id: String(habit._id),
        name: habit.name,
        category: habit.category,
        categoryId: habit.categoryId,
        prompt: habit.prompt,
        mode: habit.mode,
        budget: habit.budget,
        schedule: habit.schedule,
        domains: habit.domains,
        executables: habit.executables,
        streak: habit.streak,
        progress: habit.progress,
        todayUsageMinutes: habit.todayUsageMinutes,
        createdAt: habit.createdAt,
        updatedAt: habit.updatedAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load habits." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createHabitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const now = new Date();
    const normalizedName = parsed.data.name.trim();
    const normalizedEmail = session.user.email.toLowerCase();

    const existingHabit = await db.collection<HabitDocument>("habits").findOne(
      {
        userEmail: normalizedEmail,
        name: normalizedName,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    if (existingHabit) {
      return NextResponse.json(
        {
          message: "Habit with the same name already exists.",
          errors: {
            name: ["Habit with the same name already exists."],
          },
        },
        { status: 409 },
      );
    }

    const document: HabitDocument = {
      userEmail: normalizedEmail,
      userId: session.user.id,
      name: normalizedName,
      category: parsed.data.category,
      categoryId: parsed.data.categoryId,
      prompt: parsed.data.prompt,
      mode: parsed.data.mode,
      budget: parsed.data.mode === "Abstinence" ? null : parsed.data.budget,
      schedule: parsed.data.schedule,
      domains: parsed.data.domains,
      executables: parsed.data.executables,
      streak: 0,
      progress: parsed.data.mode === "Abstinence" ? 1 : 0,
      todayUsageMinutes: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<HabitDocument>("habits").insertOne(document);

    return NextResponse.json(
      {
        message: "Habit created successfully.",
        habit: {
          id: result.insertedId.toString(),
          ...document,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create habit." },
      { status: 500 },
    );
  }
}
