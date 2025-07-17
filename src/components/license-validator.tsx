
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

interface LicenseData {
  status: string;
}

export function LicenseValidator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const licenseKey = localStorage.getItem('licenseKey');
    if (!licenseKey) {
      setIsValidating(false);
      router.push('/');
      return;
    }

    const licenseRef = doc(db, 'licenses', licenseKey);
    const unsubscribe = onSnapshot(licenseRef, (doc) => {
      if (doc.exists()) {
        const licenseData = doc.data() as LicenseData;
        if (licenseData.status === 'active') {
          setIsValid(true);
        } else {
          setIsValid(false);
          localStorage.removeItem('licenseKey');
          toast({
            variant: 'destructive',
            title: 'Licencia Inválida',
            description: 'Tu licencia ha expirado o ha sido desactivada. Por favor, contacta a tu proveedor.',
          });
          router.push('/');
        }
      } else {
        setIsValid(false);
        localStorage.removeItem('licenseKey');
        toast({
            variant: 'destructive',
            title: 'Licencia no encontrada',
            description: 'La clave de licencia guardada ya no es válida.',
        });
        router.push('/');
      }
      setIsValidating(false);
    }, (error) => {
      console.error("Error listening to license status:", error);
      setIsValidating(false);
      // In case of network error, we might optimistically assume validity
      // or redirect. For now, we'll let them stay but show a toast.
       toast({
            variant: 'destructive',
            title: 'Error de Red',
            description: 'No se pudo verificar el estado de la licencia. Algunas funciones pueden no estar disponibles sin conexión.',
        });
    });

    return () => unsubscribe();
  }, [router, toast]);

  if (isValidating) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Verificando licencia...</p>
        </div>
      </main>
    );
  }

  if (!isValid) {
    // This case handles the flicker before redirection
     return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="flex items-center gap-2 text-destructive">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
