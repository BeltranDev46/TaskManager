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
        setError(data.error || 'Error al iniciar sesión');
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
  <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    {/* Mitad izquierda: cuadrado negro */}
    <div className="bg-[#F9F2EC] hidden lg:block">
      {/* Opcional: logo o texto aquí */}
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-center">
          <LogoGrande height={96} className="mx-auto mb-4" />
        </div>
      </div>
    </div>

    {/* Mitad derecha: formulario */}
    <div className="bg-[#D45715] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Logo pequeño arriba */}
        <div className="flex justify-center">
          <Logo height={48} />
        </div>

        <div>
          <h1 className="text-5xl font-bold text-center text-gray-900 mb-2">
            Iniciar sesión
          </h1>
          <p className="text-center text-xl text-gray-600">
            Bienvenido de vuelta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-9">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-xl text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="font-medium text-[#2853A8] hover:text-[#1E3A5F]">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  </main>
);

}
