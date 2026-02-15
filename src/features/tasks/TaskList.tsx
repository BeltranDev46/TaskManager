'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskForm } from './TaskForm';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'COMPLETED', label: 'Completada' },
  { value: 'BLOCKED', label: 'Bloqueada' },
  { value: 'CANCELED', label: 'Cancelada' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Crítica' },
];

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  project: { id: string; name: string } | null;
};

type Project = { id: string; name: string };

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    projectId: '',
  });

  async function fetchTasks() {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.projectId) params.set('projectId', filters.projectId);
    const res = await fetch(`/api/tasks?${params}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
    setLoading(false);
  }

  async function fetchProjects() {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.priority, filters.projectId]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLoading(true);
      fetchTasks();
    }
  }

  function openEdit(task: Task) {
    setEditing(task);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setLoading(true);
    fetchTasks();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Tareas</h2>
        <div className="flex gap-2">
          <a
            href="/api/export/tasks.csv"
            download="tasks-export.csv"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Exportar CSV
          </a>
          <Button onClick={() => setShowForm(true)}>Nueva tarea</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Buscar por título o descripción..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <Select
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
        />
        <Select
          options={[
            { value: '', label: 'Todos los proyectos' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
          value={filters.projectId}
          onChange={(e) => setFilters((f) => ({ ...f, projectId: e.target.value }))}
        />
      </div>

      {showForm && (
        <TaskForm
          task={editing}
          projects={projects}
          onClose={closeForm}
          onSuccess={closeForm}
        />
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2">Título</th>
                <th className="text-left py-3 px-2">Estado</th>
                <th className="text-left py-3 px-2">Prioridad</th>
                <th className="text-left py-3 px-2">Proyecto</th>
                <th className="text-left py-3 px-2">Vencimiento</th>
                <th className="text-right py-3 px-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No hay tareas.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <span className="font-medium">{t.title}</span>
                      {t.description && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {t.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-2">{t.status}</td>
                    <td className="py-3 px-2">{t.priority}</td>
                    <td className="py-3 px-2">{t.project?.name ?? '-'}</td>
                    <td className="py-3 px-2">
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString('es')
                        : '-'}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(t)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ml-1"
                        onClick={() => handleDelete(t.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
