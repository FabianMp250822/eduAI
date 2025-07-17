import { db } from '@/lib/firebase';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
import type { Topic } from '@/lib/curriculum';

/**
 * Guarda o actualiza los temas de una asignatura en Firestore.
 * @param gradeSlug El slug del grado.
 * @param subjectSlug El slug de la materia.
 * @param topics La lista de temas a guardar.
 */
export async function saveTopicsToFirebase(gradeSlug: string, subjectSlug: string, topics: Topic[]): Promise<void> {
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
