
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LicenseForm } from '@/components/license-form';
import { GraduationCap, Loader } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const licenseKey = localStorage.getItem('licenseKey');
    if (licenseKey) {
      router.push('/dashboard');
    }
  }, [router]);

  // We can show a loading state or the form directly
  // A loading state is better for UX
  if (typeof window !== 'undefined' && localStorage.getItem('licenseKey')) {
    return (
       <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Verificando licencia...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center space-x-3 text-primary">
            <GraduationCap className="h-10 w-10 md:h-12 md:w-12" />
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
              EduSync AI
            </h1>
          </div>
          <p className="text-muted-foreground max-w-sm">
            ¡Bienvenido! Ingresa tu clave de licencia para comenzar tu viaje de aprendizaje personalizado.
          </p>
        </div>
        <div className="mt-8">
          <LicenseForm />
        </div>
      </div>
    </main>
  );
}
