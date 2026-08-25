import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getSession();
  if (session?.isLoggedIn) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sm:px-12 flex justify-between items-center z-10">
        <div className="flex items-center">
          <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#D45715] via-[#f97316] to-[#1E9A63]">
            Task Flow
          </span>
        </div>
        <div className="flex gap-3 sm:gap-6 items-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-[#D45715] transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-sm font-semibold bg-[#1E9A63] text-white rounded-lg hover:bg-[#004D2B] transition-all shadow-sm hover:shadow"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 lg:py-32 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] -z-10 pointer-events-none">
          <div className="w-full h-full bg-[#D45715]/10 blur-3xl rounded-full animate-blob mix-blend-multiply opacity-70" />
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 -z-10 pointer-events-none">
          <div 
            className="w-full h-full bg-[#1E9A63]/10 blur-3xl rounded-full animate-blob mix-blend-multiply opacity-70" 
            style={{ animationDelay: "2s", animationDuration: "12s" }} 
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D45715]/10 text-[#D45715] text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-[#D45715] animate-pulse" />
          Simplifica tu vida laboral
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 max-w-4xl leading-tight">
          Organiza tu trabajo, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D45715] to-[#f97316]">
            alcanza tus metas
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
          TaskFlow es la herramienta definitiva para gestionar proyectos, controlar el progreso de tus tareas diarias y colaborar de manera efectiva sin estrés.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="px-8 py-4 bg-[#1E9A63] text-white text-lg font-bold rounded-xl hover:bg-[#004D2B] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
          >
            Comenzar gratis hoy
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 text-lg font-bold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto"
          >
            Ya tengo una cuenta
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Todo lo que necesitas para ser productivo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Nuestra plataforma cuenta con funcionalidades diseñadas específicamente para ayudarte a mantener el control de tu tiempo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#D45715]/10 text-[#D45715] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Proyectos</h3>
              <p className="text-gray-600 leading-relaxed">Crea múltiples proyectos, agrúpalos y mantén todo tu trabajo organizado de forma lógica y estructurada en un solo lugar.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#1E9A63]/10 text-[#1E9A63] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Control de Tareas</h3>
              <p className="text-gray-600 leading-relaxed">Asigna prioridades, fechas de vencimiento y horas estimadas. Actualiza estados de pendiente a completado fácilmente.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reportes y Métricas</h3>
              <p className="text-gray-600 leading-relaxed">Visualiza tu progreso con estadísticas en tiempo real y exporta tus tareas a CSV cuando necesites crear reportes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="mb-6">
            <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#D45715] to-[#1E9A63]">
              Task Flow
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TaskFlow. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
