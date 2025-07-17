
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Users, CheckCircle, XCircle, Loader } from 'lucide-react';

interface LicenseData {
  status: string;
  currentInstalls: number;
  maxInstalls: number;
}

export function LicenseStatus() {
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const licenseKey = localStorage.getItem('licenseKey');
    if (!licenseKey) {
      setLoading(false);
      setError("No se encontró la clave de licencia.");
      return;
    }

    const licenseRef = doc(db, "licenses", licenseKey);
    const unsubscribe = onSnapshot(licenseRef, (doc) => {
      if (doc.exists()) {
        setLicenseData(doc.data() as LicenseData);
      } else {
        setError("Licencia no válida.");
      }
      setLoading(false);
    }, (err) => {
      console.error("Error al obtener estado de licencia:", err);
      setError("Error de conexión.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <Badge variant="outline" className="gap-2 py-1.5 px-3">
            <Loader className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs font-medium">Cargando...</span>
        </Badge>
    );
  }

  if (error || !licenseData) {
     return (
        <Badge variant="destructive" className="gap-2 py-1.5 px-3">
            <XCircle className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{error || 'Inválida'}</span>
        </Badge>
    );
  }

  const isLicenseActive = licenseData.status === 'active';
  const remainingInstalls = licenseData.maxInstalls - licenseData.currentInstalls;

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Badge variant={isLicenseActive ? 'secondary' : 'destructive'} className="gap-2 py-1.5 px-3">
        {isLicenseActive ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <XCircle className="h-3.5 w-3.5" />}
        <span className="text-xs font-medium">
          Licencia: {isLicenseActive ? 'Activa' : 'Inactiva'}
        </span>
      </Badge>
      <Badge variant="outline" className="gap-2 py-1.5 px-3">
        <Users className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">
          {remainingInstalls} de {licenseData.maxInstalls} disp.
        </span>
      </Badge>
    </div>
  );
}
