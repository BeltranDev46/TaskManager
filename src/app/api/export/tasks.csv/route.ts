import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth } from '@/lib/auth';
import { getTasks } from '@/lib/services/task.service';

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const tasks = await getTasks(session.userId);
    const headers = [
      'ID',
      'Título',
      'Descripción',
      'Estado',
      'Prioridad',
      'Proyecto',
      'Fecha vencimiento',
      'Horas estimadas',
      'Horas reales',
      'Creado',
    ];
    const rows = tasks.map((t) => [
      t.id,
      t.title,
      t.description ?? '',
      t.status,
      t.priority,
      t.project?.name ?? '',
      formatDate(t.dueDate),
      t.estimatedHours ?? '',
      t.actualHours ?? '',
      formatDate(t.createdAt),
    ]);
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="tasks-export.csv"',
      },
    });
  } catch (err) {
    console.error('Export CSV error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
