'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo, LogoGrande } from '@/components/ui/Logo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const errors = Object.values(data.details.fieldErrors)[0] as string[];
          setError(errors[0] || 'Datos inválidos');
        } else {
          setError(data.error || 'Error al iniciar sesión');
        }
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      {/* Mitad izquierda: Branding */}
      <div className="bg-[#D45715] hidden lg:flex flex-col items-center justify-center p-12">
        <div className="text-white text-center w-full max-w-xl">
          <LogoGrande height={455} className="mx-auto mb-8 drop-shadow-xl" />
          <h2 className="text-3xl font-bold mb-4">Bienvenido de nuevo</h2>
          <p className="text-lg font-medium text-white/90">
            Gestiona tus tareas y proyectos de forma eficiente. Todo lo que necesitas en un solo lugar.
          </p>
        </div>
      </div>

      {/* Mitad derecha: formulario */}
      <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
          {/* Logo móvil */}
          <div className="flex justify-center lg:hidden mb-2">
            <Logo height={56} />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar sesión
            </h1>
            <p className="text-sm text-gray-500">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar a mi cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 pt-4">
            ¿No tienes cuenta?{" "}
            <Link href="/signup" className="font-semibold text-[#1E9A63] hover:text-[#004D2B] transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );

}
