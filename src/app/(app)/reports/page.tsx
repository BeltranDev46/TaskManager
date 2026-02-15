import { requireAuth } from '@/lib/auth';
import {
  getTaskStats,
  getTasksByStatus,
  getTasksByProject,
} from '@/lib/services/task.service';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default async function ReportsPage() {
  const session = await requireAuth();
  if (!session) return null;

  const [stats, byStatus, byProject] = await Promise.all([
    getTaskStats(session.userId),
    getTasksByStatus(session.userId),
    getTasksByProject(session.userId),
  ]);

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En progreso',
    COMPLETED: 'Completada',
    BLOCKED: 'Bloqueada',
    CANCELED: 'Cancelada',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Reportes</h2>
        <Link
          href="/api/export/tasks.csv"
          download="tasks-export.csv"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Exportar CSV
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <h3 className="font-semibold mb-4">Resumen general</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completadas</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Vencidas</p>
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tareas por estado</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Estado</th>
                <th className="text-right py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {byStatus.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Sin datos
                  </td>
                </tr>
              ) : (
                byStatus.map((row) => (
                  <tr key={row.status} className="border-b border-gray-100">
                    <td className="py-2">
                      {statusLabels[row.status] ?? row.status}
                    </td>
                    <td className="py-2 text-right font-medium">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tareas por proyecto</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Proyecto</th>
                <th className="text-right py-2">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {byProject.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    Sin datos
                  </td>
                </tr>
              ) : (
                byProject.map((row) => (
                  <tr key={row.projectId ?? 'none'} className="border-b border-gray-100">
                    <td className="py-2">{row.projectName}</td>
                    <td className="py-2 text-right font-medium">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
