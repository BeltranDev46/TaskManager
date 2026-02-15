import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth } from '@/lib/auth';
import { getProjects } from '@/lib/services/project.service';
import { createProject } from '@/lib/services/project.service';
import { createProjectSchema } from '@/lib/validators';

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const projects = await getProjects(session.userId);
    return NextResponse.json(projects);
  } catch (err) {
    console.error('Get projects error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const project = await createProject(session.userId, parsed.data);
    return NextResponse.json(project);
  } catch (err) {
    console.error('Create project error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
