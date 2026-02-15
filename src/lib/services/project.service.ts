import { prisma } from '@/lib/db';
import type { CreateProjectInput, UpdateProjectInput } from '@/lib/validators';

export function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { tasks: true } } },
  });
}

export function getProjectById(id: string, userId: string) {
  return prisma.project.findFirst({
    where: { id, userId },
    include: { tasks: true },
  });
}

export function createProject(userId: string, input: CreateProjectInput) {
  return prisma.project.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
    },
  });
}

export function updateProject(
  id: string,
  userId: string,
  input: UpdateProjectInput
) {
  return prisma.project.updateMany({
    where: { id, userId },
    data: input,
  });
}

export function deleteProject(id: string, userId: string) {
  return prisma.project.deleteMany({
    where: { id, userId },
  });
}
