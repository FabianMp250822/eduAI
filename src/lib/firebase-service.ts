import { db } from '@/lib/firebase';
import { doc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';
import type { Topic } from '@/lib/curriculum';

interface TopicToSave extends Omit<Topic, 'slug' | 'progress'> {
    slug: string;
    progress: number;
    content?: string; // Add content field
}

/**
 * Verifica si ya existen temas para una asignatura en Firestore.
 * @param gradeSlug El slug del grado.
 * @param subjectSlug El slug de la materia.
 * @returns {Promise<boolean>} True si existen temas, false en caso contrario.
 */
export async function checkTopicsExist(gradeSlug: string, subjectSlug: string): Promise<boolean> {
  const docId = `${gradeSlug}_${subjectSlug}`;
  const subjectRef = doc(db, 'subjects', docId);
  try {
    const docSnap = await getDoc(subjectRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.topics && data.topics.length > 0;
    }
    return false;
  } catch (error) {
    console.error("Error al verificar la existencia de temas:", error);
    return false; // Asumir que no existen en caso de error
  }
}


/**
 * Guarda o actualiza los temas de una asignatura en Firestore.
 * @param gradeSlug El slug del grado.
 * @param subjectSlug El slug de la materia.
 * @param topics La lista de temas a guardar.
 */
export async function saveTopicsToFirebase(gradeSlug: string, subjectSlug: string, topics: TopicToSave[]): Promise<void> {
  const docId = `${gradeSlug}_${subjectSlug}`;
  const subjectRef = doc(db, 'subjects', docId);

  console.log(`Intentando guardar ${topics.length} temas en el documento: ${docId}`);

  try {
    // Usamos setDoc con { merge: true } para crear el documento si no existe,
    // o fusionar los datos si ya existe. `arrayUnion` se usa para añadir
    // los nuevos temas al array 'topics' sin duplicados, evitando sobrescribir
    // los temas que ya puedan existir en el documento.
    await setDoc(subjectRef, {
      gradeSlug: gradeSlug,
      subjectSlug: subjectSlug,
      topics: arrayUnion(...topics)
    }, { merge: true });

    console.log(`Temas guardados exitosamente para ${subjectSlug} en ${gradeSlug}.`);
  } catch (error) {
    console.error("Error al guardar temas en Firebase:", error);
    throw new Error('No se pudieron guardar los temas en la base de datos.');
  }
}
