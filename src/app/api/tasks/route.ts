import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getTasks, createTask } from "@/lib/services/task.service";
import { createTaskSchema, taskFilterSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsedFilters = taskFilterSchema.safeParse({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      projectId: searchParams.get("projectId") || undefined,
    });

    if (!parsedFilters.success) {
      return NextResponse.json(
        { error: "Filtros inválidos", details: parsedFilters.error.flatten() },
        { status: 400 }
      );
    }

    const tasks = await getTasks(session.userId, parsedFilters.data);
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("Get tasks error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const task = await createTask(session.userId, parsed.data);
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
