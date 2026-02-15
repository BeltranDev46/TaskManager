import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getSession();
  if (session?.isLoggedIn) {
    redirect('/dashboard');
  }
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Task Manager</h1>
      <p className="text-gray-600 text-center max-w-md">
        Gestiona tus proyectos y tareas de forma simple y eficiente.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Registrarse
        </Link>
      </div>
    </main>
  );
}
