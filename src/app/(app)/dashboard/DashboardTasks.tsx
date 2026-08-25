'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TaskForm } from '@/features/tasks/TaskForm';

const PRIORITY_WEIGHT = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

type Task = any;

export function DashboardTasks({ initialTasks, projects }: { initialTasks: Task[], projects: { id: string, name: string }[] }) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [projectId, setProjectId] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    let list = [...initialTasks];
    
    // filter
    if (projectId) {
      list = list.filter(t => t.projectId === projectId);
    }
    
    // sort
    list.sort((a, b) => {
      if (sortBy === 'priority') {
        const diff = (PRIORITY_WEIGHT[b.priority as keyof typeof PRIORITY_WEIGHT] || 0) - (PRIORITY_WEIGHT[a.priority as keyof typeof PRIORITY_WEIGHT] || 0);
        if (diff !== 0) return diff;
        // fallback to date
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      } else {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        if (dateA !== dateB) return dateA - dateB;
        // fallback to priority
        return (PRIORITY_WEIGHT[b.priority as keyof typeof PRIORITY_WEIGHT] || 0) - (PRIORITY_WEIGHT[a.priority as keyof typeof PRIORITY_WEIGHT] || 0);
      }
    });
    
    return list;
  }, [initialTasks, projectId, sortBy]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Tareas</h3>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 items-center w-full justify-center">
          <select 
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9A63] outline-none transition bg-white text-sm cursor-pointer"
            value={projectId} 
            onChange={e => setProjectId(e.target.value)}
          >
            <option value="">Todos los proyectos</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button 
            variant="ghost" 
            className="text-sm bg-white border border-gray-300 px-3 py-1.5 hover:bg-gray-50 text-gray-700"
            onClick={() => setSortBy(s => s === 'date' ? 'priority' : 'date')}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              Orden: {sortBy === 'date' ? 'Fecha límite' : 'Prioridad'}
            </span>
          </Button>
        </div>
      </div>
      <Card className="overflow-hidden relative">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {initialTasks.length === 0 ? '¡Genial! No tienes tareas pendientes.' : 'No hay tareas en este proyecto.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredTasks.map((task) => (
              <li 
                key={task.id} 
                className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center cursor-pointer"
                onClick={() => setEditingTask(task)}
              >
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-[#1E9A63] transition-colors">{task.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {task.project?.name ?? 'Sin proyecto'} 
                    {task.dueDate && ` • Vence: ${new Date(task.dueDate).toLocaleDateString('es')}`}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  task.priority === 'HIGH' || task.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {task.priority === 'HIGH' || task.priority === 'CRITICAL' ? 'Prioritaria' : 'Normal'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {editingTask && (
        <TaskForm
          task={editingTask}
          projects={projects}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
