import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { AppLayout } from '@/components/layout/AppLayout';

export default async function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  if (!session) {
    redirect('/login');
  }
  return <AppLayout username={session.username}>{children}</AppLayout>;
}
