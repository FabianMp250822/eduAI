import { useEffect, useState } from "react";
import { syncFirestoreToIndexedDB, getFromIndexedDB } from "@/lib/local-sync";

/**
 * Hook para sincronizar automáticamente una colección de Firestore a IndexedDB
 * y leer siempre local, incluso offline.
 * @param {string} collectionName - Nombre de la colección de Firestore
 * @returns {object[]} - Datos locales de la colección
 */
export function useOfflineCollection(collectionName: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sincroniza automáticamente al montar (puedes agregar un botón si prefieres manual)
  useEffect(() => {
    async function syncAndLoad() {
      try {
        await syncFirestoreToIndexedDB(collectionName);
      } catch {}
      const localData = await getFromIndexedDB(collectionName);
      setData(localData as any[]);
      setLoading(false);
    }
    syncAndLoad();
    // eslint-disable-next-line
  }, [collectionName]);

  // Siempre lee local, incluso si recargas offline
  useEffect(() => {
    let interval = setInterval(async () => {
      const localData = await getFromIndexedDB(collectionName);
      setData(localData as any[]);
    }, 5000); // refresca cada 5s por si hay cambios locales
    return () => clearInterval(interval);
  }, [collectionName]);

  return { data, loading };
}
