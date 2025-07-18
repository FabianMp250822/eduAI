
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LicenseForm } from '@/components/license-form';
import { Loader } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const licenseKey = localStorage.getItem('licenseKey');
    if (licenseKey) {
      router.push('/dashboard');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
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
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/edusync-ai-ldeq7.firebasestorage.app/o/image-removebg-preview.png?alt=media&token=4da022e6-4a05-4662-b40b-644569d3e291" 
            alt="EduSync AI Logo"
            width={250}
            height={250}
            className="h-24 w-auto"
            priority
          />
          <p className="text-muted-foreground max-w-sm pt-4">
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
