import { prisma } from '@/lib/db';
import type { TaskStatus, TaskPriority, Prisma } from '@prisma/client';
import type { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from '@/lib/validators';

function parseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function getTasks(userId: string, filters?: TaskFilterInput) {
  const where: Prisma.TaskWhereInput = {
    userId,
  };

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' as const } },
      { description: { contains: filters.search, mode: 'insensitive' as const } },
    ];
  }
  if (filters?.status) {
    where.status = filters.status as TaskStatus;
  }
  if (filters?.priority) {
    where.priority = filters.priority as TaskPriority;
  }
  if (filters?.projectId) {
    where.projectId = filters.projectId;
  }

  return prisma.task.findMany({
    where,
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    include: { project: { select: { id: true, name: true } } },
  });
}

export function getTaskById(id: string, userId: string) {
  return prisma.task.findFirst({
    where: { id, userId },
    include: { project: true },
  });
}

export function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      status: (input.status as TaskStatus) || 'PENDING',
      priority: (input.priority as TaskPriority) || 'MEDIUM',
      projectId: input.projectId || null,
      dueDate: parseDate(input.dueDate),
      estimatedHours: input.estimatedHours ?? null,
      actualHours: input.actualHours ?? null,
    },
    include: { project: { select: { id: true, name: true } } },
  });
}

export function updateTask(
  id: string,
  userId: string,
  input: UpdateTaskInput
) {
  const { dueDate, ...rest } = input;
  const data = {
    ...rest,
    ...(dueDate !== undefined && { dueDate: parseDate(dueDate) }),
  };
  return prisma.task.updateMany({
    where: { id, userId },
    data: data as Prisma.TaskUpdateManyMutationInput,
  });
}

export function deleteTask(id: string, userId: string) {
  return prisma.task.deleteMany({
    where: { id, userId },
  });
}

export async function getTaskStats(userId: string) {
  const [total, completed, pending, overdue] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({
      where: { userId, status: 'COMPLETED' },
    }),
    prisma.task.count({
      where: {
        userId,
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
    }),
    prisma.task.count({
      where: {
        userId,
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
    }),
  ]);
  return { total, completed, pending, overdue };
}

export async function getTasksByStatus(userId: string) {
  const result = await prisma.task.groupBy({
    by: ['status'],
    where: { userId },
    _count: { id: true },
  });
  return result.map((r) => ({ status: r.status, count: r._count.id }));
}

export async function getTasksByProject(userId: string) {
  const result = await prisma.task.groupBy({
    by: ['projectId'],
    where: { userId },
    _count: { id: true },
  });
  const projectIds = result.map((r) => r.projectId).filter(Boolean) as string[];
  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds }, userId },
    select: { id: true, name: true },
  });
  const projectMap = new Map(projects.map((p) => [p.id, p.name]));
  return result.map((r) => ({
    projectId: r.projectId,
    projectName: r.projectId ? projectMap.get(r.projectId) ?? 'Sin proyecto' : 'Sin proyecto',
    count: r._count.id,
  }));
}
