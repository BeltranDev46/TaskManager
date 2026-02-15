import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import type { SignupInput, LoginInput } from '@/lib/validators';

export async function createUser(input: SignupInput) {
  const passwordHash = await hashPassword(input.password);
  return prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      passwordHash,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function validateLogin(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) return null;
  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) return null;
  return user;
}
