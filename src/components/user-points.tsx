
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Award, Loader } from 'lucide-react';

interface LicenseData {
  points: number;
}

export function UserPoints() {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const licenseKey = localStorage.getItem('licenseKey');
    if (!licenseKey) {
      setLoading(false);
      return;
    }

    const licenseRef = doc(db, 'licenses', licenseKey);
    const unsubscribe = onSnapshot(
      licenseRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as LicenseData;
          setPoints(data.points ?? 0);
        } else {
          setPoints(0);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error al obtener los puntos:', err);
        setPoints(0);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Badge variant="secondary" className="gap-2 py-1.5 px-3">
        <Loader className="h-4 w-4 animate-spin" />
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-2 py-1.5 px-3">
      <Award className="h-4 w-4 text-orange-400" />
      <span className="font-semibold">{points ?? 0} Puntos</span>
    </Badge>
  );
}
