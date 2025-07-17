
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Loader, Home, Bot, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_UID = '0SBZmSJNPldnrGJmlQEhdnnIsY73';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) {
      return; 
    }
    
    if (pathname === '/admin/login') {
        if (user && user.uid === ADMIN_UID) {
            router.replace('/admin');
        } else {
            setIsAuthorized(true); 
        }
        return;
    }

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

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin"
            className={`transition-colors hover:text-foreground ${pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Gestión Manual</span>
          </Link>
          <Link
            href="/admin/generate-content"
            className={`transition-colors hover:text-foreground ${pathname === '/admin/generate-content' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Bot className="h-5 w-5" />
             <span className="sr-only">Generar con IA</span>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
