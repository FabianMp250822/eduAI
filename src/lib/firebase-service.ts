import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
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
    // Usamos arrayUnion para añadir los nuevos temas sin sobrescribir los existentes.
    // Firestore se encargará de crear el documento si no existe con la primera llamada a updateDoc.
    // Para asegurar que el documento se cree si no existe, necesitamos un `set` con `{ merge: true }`
    // o manejar la creación. Una forma más segura es usar `update` y manejar el error si no existe,
    // pero `arrayUnion` en una actualización crea el campo si no existe en un documento que sí existe.
    // La forma más robusta es garantizar que el documento exista. Aquí asumimos un enfoque simple.
    
    // Un enfoque más seguro es usar una transacción, pero para este caso `updateDoc` con `arrayUnion` es suficiente.
    // Sin embargo, `updateDoc` falla si el documento no existe. Un `set` con merge es mejor.
    
    // Firestore no tiene una forma directa de "crear o actualizar array".
    // Lo más simple es un `set` con `merge`, pero eso reemplaza el array.
    // Para añadir, que es lo que queremos, necesitamos leer y luego escribir, o usar arrayUnion.
    // `arrayUnion` es la mejor opción para evitar duplicados si se ejecuta varias veces.

    // La documentación dice que updateDoc fallará si el documento no existe.
    // El enfoque simple es `set` con merge, pero vamos a usar `update` para ser más explícitos.
    // Una implementación más robusta leería el doc primero o usaría una transacción.
    
    // Para este caso, vamos a asumir que el documento podría no existir, así que usamos `set` con `merge:true`
    // y para evitar sobrescribir, usamos `arrayUnion`.
    await updateDoc(subjectRef, {
        topics: arrayUnion(...topics)
    }).catch(async (error) => {
        // Si el documento no existe, `updateDoc` falla. Lo creamos.
        if (error.code === 'not-found') {
            console.log(`El documento ${docId} no existe. Creándolo...`);
            await db.collection('subjects').doc(docId).set({
                gradeSlug,
                subjectSlug,
                topics: topics
            });
        } else {
            throw error;
        }
    });

    console.log(`Temas guardados exitosamente para ${subjectSlug} en ${gradeSlug}.`);
  } catch (error) {
    console.error("Error al guardar temas en Firebase:", error);
    throw new Error('No se pudieron guardar los temas en la base de datos.');
  }
}
