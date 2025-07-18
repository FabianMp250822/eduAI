
import { getDocs, collection, getFirestore } from "firebase/firestore";

const DB_NAME = "eduai-local-db";
const DB_VERSION = 1; 
// Lista de todos los almacenes de objetos (tablas) que usará la aplicación.
const STORES = ["usuarios", "cursos", "temas", "licenses", "actions", "subjects", "ai_content"];

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("Error al abrir IndexedDB:", request.error);
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      STORES.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          // Usamos 'id' como la clave por defecto. Si una colección usa una clave diferente,
          // se podría necesitar una configuración más avanzada aquí.
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
  });
}

async function saveToIndexedDB(storeName: string, dataArray: any[]) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    // Verificar si el almacén existe antes de iniciar la transacción.
    if (!db.objectStoreNames.contains(storeName)) {
        console.error(`El almacén de objetos '${storeName}' no fue encontrado.`);
        db.close();
        // Aunque onupgradeneeded debería haberlo creado, esto previene errores.
        reject(new Error(`Object store ${storeName} not found.`));
        return;
    }
      
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    // Limpiar el almacén antes de añadir nuevos datos para evitar duplicados.
    const clearRequest = store.clear();
    clearRequest.onerror = (event) => {
        console.error(`Error al limpiar el almacén ${storeName}:`, (event.target as IDBRequest).error);
    }
    
    dataArray.forEach((item) => {
      // Asegurarse de que cada item tiene un 'id'.
      if (!item.id) {
          console.warn(`Item en '${storeName}' sin 'id' fue omitido:`, item);
          return;
      }
      store.put(item);
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = (event) => {
      console.error(`Error en la transacción para '${storeName}':`, transaction.error);
      db.close();
      reject(transaction.error);
    };
  });
}

export async function getFromIndexedDB(storeName: string): Promise<any[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains(storeName)) {
            db.close();
            resolve([]); // Devuelve un array vacío si el almacén no existe.
            return;
        }

        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
        };

        getAllRequest.onerror = (event) => {
            console.error(`Error al leer de '${storeName}':`, getAllRequest.error);
            reject(getAllRequest.error);
        };
        
        transaction.oncomplete = () => {
            db.close();
        }
    });
}


// Sincroniza una colección de Firestore a IndexedDB
export async function syncFirestoreToIndexedDB(collectionName: string) {
  if (!navigator.onLine) {
      console.log(`Sin conexión, no se puede sincronizar la colección: ${collectionName}`);
      return;
  }
  
  try {
    const db = getFirestore();
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    await saveToIndexedDB(collectionName, data);
    console.log(`Colección '${collectionName}' sincronizada exitosamente a IndexedDB.`);
  } catch(error) {
    console.error(`Error al sincronizar la colección '${collectionName}':`, error);
    // No relanzamos el error para no detener otras operaciones de la app.
  }
}
