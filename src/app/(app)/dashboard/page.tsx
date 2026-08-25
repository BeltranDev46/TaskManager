import { requireAuth } from '@/lib/auth';
import { getPendingTasks } from '@/lib/services/task.service';
import { prisma } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { DashboardTasks } from './DashboardTasks';

export default async function DashboardPage() {
  const session = await requireAuth();
  if (!session) return null;

  const [pendingTasks, projects] = await Promise.all([
    getPendingTasks(session.userId, 50),
    prisma.project.findMany({ where: { userId: session.userId }, select: { id: true, name: true } })
  ]);

  return (
    <div>
      <div className="flex flex-col gap-10 mb-8 w-full max-w-5xl mx-auto">
        <DashboardTasks initialTasks={pendingTasks} projects={projects} />

        <div className="w-full">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Acciones Rápidas</h3>
          </div>
          <Card className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/tasks"
              className="flex justify-center items-center px-4 py-2.5 bg-[#1E9A63] text-white font-medium rounded-lg hover:bg-[#168D5A] shadow-md shadow-[#1E9A63]/20 transition-all"
            >
              Ir a Tareas
            </Link>
            <Link
              href="/projects"
              className="flex justify-center items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ir a Proyectos
            </Link>
            <Link
              href="/reports"
              className="flex justify-center items-center px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ver Reportes
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
