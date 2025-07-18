import { getDocs, collection, getFirestore } from "firebase/firestore";

// Utilidad para guardar datos en IndexedDB
function saveToIndexedDB(storeName, dataArray) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("eduai-local-db", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      dataArray.forEach((item) => store.put(item));
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = (e) => reject(e);
    };
    request.onerror = (e) => reject(e);
  });
}

// Utilidad para leer datos de IndexedDB
export function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("eduai-local-db", 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const getAll = store.getAll();
      getAll.onsuccess = () => {
        resolve(getAll.result);
        db.close();
      };
      getAll.onerror = (e) => reject(e);
    };
    request.onerror = (e) => reject(e);
  });
}

// Sincroniza una colección de Firestore a IndexedDB
export async function syncFirestoreToIndexedDB(collectionName) {
  const db = getFirestore();
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  await saveToIndexedDB(collectionName, data);
}
