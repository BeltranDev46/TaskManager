import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth } from '@/lib/auth';
import {
  getTaskStats,
  getTasksByStatus,
  getTasksByProject,
} from '@/lib/services/task.service';

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const [stats, byStatus, byProject] = await Promise.all([
      getTaskStats(session.userId),
      getTasksByStatus(session.userId),
      getTasksByProject(session.userId),
    ]);
    return NextResponse.json({
      stats,
      byStatus,
      byProject,
    });
  } catch (err) {
    console.error('Reports summary error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
