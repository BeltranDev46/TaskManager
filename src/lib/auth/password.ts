import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  // El "10" es el coste (salt rounds), estándar para seguridad
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  // OJO: bcrypt.compare pide primero la password plana y luego el hash
  // (al revés que argon2.verify, pero aquí ya lo he ajustado por ti)
  return bcrypt.compare(password, hash);
}
