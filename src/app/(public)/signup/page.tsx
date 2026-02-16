'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo, LogoGrande } from '@/components/ui/Logo';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al registrarse');
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
  <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 lg:[grid-auto-flow:column-reverse]">
    {/* Mitad izquierda: formulario (izquierda en desktop) */}
    <div className="bg-[#D45715] flex flex-col items-center justify-center rounded-xl px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo height={48} />
        </div>

        <div>
          <h1 className="text-5xl font-bold text-center text-black mb-2">
            Crear cuenta
          </h1>
          <p className="text-center text-white/80">
          </p>
        </div>

        <div className=" rounded-xl ">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="solo letras, números y _"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {error && <p className="text-xl text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xl text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-[#2853A8] hover:text-[#1E3A5F]">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Mitad derecha: fondo (derecha en desktop) */}
    <div className="bg-[#F9F2EC] hidden lg:block">
      <div className="flex items-center justify-center h-full">
        <div className="text-black text-center">
          <LogoGrande height={96} className="mx-auto mb-4" />
        </div>
      </div>
    </div>
  </main>
);

}
