import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { loginSchema } from '@/lib/validators';
import { validateLogin } from '@/lib/services/auth.service';
import { sessionOptions, SessionData } from '@/lib/auth/session'; // Importa sessionOptions directamente

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const user = await validateLogin(parsed.data);
    if (!user) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // CLAVE: Crear la respuesta primero
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username },
    });

    // CLAVE: Pasar request y response a getIronSession
    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    
    session.userId = user.id;
    session.username = user.username;
    session.email = user.email;
    session.isLoggedIn = true;
    
    await session.save();

    // CLAVE: Retornar la respuesta que tiene la cookie seteada
    return response;

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
