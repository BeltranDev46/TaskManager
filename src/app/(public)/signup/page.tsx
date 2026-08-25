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
        if (data.details?.fieldErrors) {
          const errors = Object.values(data.details.fieldErrors)[0] as string[];
          setError(errors[0] || 'Datos inválidos');
        } else {
          setError(data.error || 'Error al registrarse');
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
          <h2 className="text-3xl font-bold mb-4">Comienza tu viaje</h2>
          <p className="text-lg font-medium text-white/90">
            Regístrate para empezar a organizar tus proyectos y alcanzar tus metas más rápido.
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
              Crear cuenta
            </h1>
            <p className="text-sm text-gray-500">
              Completa tus datos para registrarte gratis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
            <Input
              label="Nombre de usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ej: juan_perez"
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
            
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse ahora'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 pt-4">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-[#1E9A63] hover:text-[#004D2B] transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );

}
