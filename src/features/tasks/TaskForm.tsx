'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

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
  estimatedHours?: number | null;
  actualHours?: number | null;
  projectId?: string | null;
  project?: { id: string; name: string } | null;
};

type Project = { id: string; name: string };

function toInputDate(date: string | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export function TaskForm({
  task,
  projects,
  onClose,
  onSuccess,
}: {
  task?: Task | null;
  projects: Project[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [actualHours, setActualHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setStatus(task.status);
      setPriority(task.priority);
      setProjectId(task.projectId ?? task.project?.id ?? '');
      setDueDate(toInputDate(task.dueDate));
      setEstimatedHours(task.estimatedHours?.toString() ?? '');
      setActualHours(task.actualHours?.toString() ?? '');
    }
  }, [task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        title,
        description: description || undefined,
        status,
        priority,
        projectId: projectId || null,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        actualHours: actualHours ? parseFloat(actualHours) : null,
      };
      const url = task ? `/api/tasks/${task.id}` : '/api/tasks';
      const method = task ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.details?.fieldErrors?.title?.[0] || 'Error');
        return;
      }
      onSuccess();
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  const projectOptions = [
    { value: '', label: 'Sin proyecto' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8">
        <h3 className="text-lg font-semibold mb-4">
          {task ? 'Editar tarea' : 'Nueva tarea'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Estado"
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <Select
              label="Prioridad"
              options={PRIORITY_OPTIONS}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <Select
            label="Proyecto"
            options={projectOptions}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <Input
            label="Fecha de vencimiento"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Horas estimadas"
              type="number"
              min="0"
              step="0.5"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
            />
            <Input
              label="Horas reales"
              type="number"
              min="0"
              step="0.5"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : task ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
