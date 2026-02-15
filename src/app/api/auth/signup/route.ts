import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { signupSchema } from '@/lib/validators';
import { createUser } from '@/lib/services/auth.service';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: parsed.data.email }, { username: parsed.data.username }],
      },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error:
            existingUser.email === parsed.data.email
              ? 'Email ya registrado'
              : 'Username ya existe',
        },
        { status: 409 }
      );
    }

    const user = await createUser(parsed.data);

    const session = await getSession();
    session.userId = user.id;
    session.username = user.username;
    session.email = user.email;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
