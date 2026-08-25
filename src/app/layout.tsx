import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#1E9A63',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Task Flow',
  description: 'Gestor de Tareas y Proyectos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Task Flow',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/api/pwa-icon?size=32", 
    apple: "/api/pwa-icon?size=180",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
