import { requireAuth } from '@/lib/auth';
import { getTaskStats } from '@/lib/services/task.service';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await requireAuth();
  if (!session) return null;

  const stats = await getTaskStats(session.userId);

  const cards = [
    { label: 'Total tareas', value: stats.total, color: 'bg-blue-500' },
    { label: 'Completadas', value: stats.completed, color: 'bg-green-500' },
    { label: 'Pendientes', value: stats.pending, color: 'bg-amber-500' },
    { label: 'Vencidas', value: stats.overdue, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Resumen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Card key={card.label} className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{card.label}</span>
              <span
                className={`w-3 h-3 rounded-full ${card.color}`}
                aria-hidden
              />
            </div>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </Card>
        ))}
      </div>
      <div className="flex gap-4">
        <Link
          href="/tasks"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ir a Tareas
        </Link>
        <Link
          href="/projects"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Ir a Proyectos
        </Link>
        <Link
          href="/reports"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Ver Reportes
        </Link>
      </div>
    </div>
  );
}
