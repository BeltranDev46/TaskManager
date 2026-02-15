'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProjectForm } from './ProjectForm';

type Project = {
  id: string;
  name: string;
  description: string | null;
  _count: { tasks: number };
};

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  async function fetchProjects() {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este proyecto?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) fetchProjects();
  }

  function openEdit(project: Project) {
    setEditing(project);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    fetchProjects();
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Proyectos</h2>
        <Button onClick={() => setShowForm(true)}>Nuevo proyecto</Button>
      </div>

      {showForm && (
        <ProjectForm
          project={editing}
          onClose={closeForm}
          onSuccess={closeForm}
        />
      )}

      <div className="space-y-3">
        {projects.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No hay proyectos. Crea uno para empezar.
          </Card>
        ) : (
          projects.map((p) => (
            <Card key={p.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{p.name}</h3>
                {p.description && (
                  <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {p._count.tasks} tarea(s)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(p)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
