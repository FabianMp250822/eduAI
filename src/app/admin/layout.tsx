
'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_UID = '0SBZmSJNPldnrGJmlQEhdnnIsY73';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) {
      return; // Espera a que termine la carga del estado de autenticación
    }
    
    if (pathname === '/admin/login') {
        if (user && user.uid === ADMIN_UID) {
            // Si el admin ya está logueado y va a /login, redirigir al dashboard
            router.replace('/admin');
        } else {
            // No está logueado y está en la página de login, no hacer nada.
            setIsAuthorized(true); // Permite que se muestre el children (página de login)
        }
        return;
    }

    // Para cualquier otra ruta dentro de /admin
    if (user && user.uid === ADMIN_UID) {
      setIsAuthorized(true);
    } else {
      router.replace('/admin/login');
    }

  }, [user, loading, router, pathname]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/login');
  };

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si es la página de login, no renderizar el layout del dashboard de admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <h1 className="text-lg font-semibold">Panel de Administración</h1>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
