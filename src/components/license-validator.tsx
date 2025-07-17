
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

    // Assume the license is valid locally to allow offline access immediately.
    setIsValid(true);
    setIsValidating(false);

    const licenseRef = doc(db, 'licenses', licenseKey);
    const unsubscribe = onSnapshot(licenseRef, (doc) => {
      // This part only runs when there is a connection to Firebase
      if (doc.exists()) {
        const licenseData = doc.data() as LicenseData;
        if (licenseData.status !== 'active') {
          // The license is confirmed to be inactive.
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
        // The license is confirmed to not exist anymore.
        setIsValid(false);
        localStorage.removeItem('licenseKey');
        toast({
            variant: 'destructive',
            title: 'Licencia no encontrada',
            description: 'La clave de licencia guardada ya no es válida.',
        });
        router.push('/');
      }
    }, (error) => {
      // This error handler is key for offline mode.
      // It triggers when the client can't connect to Firestore.
      console.warn("No se pudo verificar el estado de la licencia (posiblemente sin conexión). Se permitirá el acceso con la licencia local.");
      // We don't do anything, allowing the user to continue with their offline session.
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

  // If the license is not valid (after online check), show redirecting state.
  if (!isValid) {
     return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
        <div className="flex items-center gap-2 text-destructive">
          <Loader className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </main>
    );
  }

  // If we reach here, the license is considered valid (either locally or confirmed online).
  return <>{children}</>;
}
