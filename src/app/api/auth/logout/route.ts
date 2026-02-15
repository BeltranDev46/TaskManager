import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
