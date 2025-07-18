
'use server';

/**
 * @fileOverview AI flow for generating a single curriculum topic on-demand.
 *
 * - generateSingleTopic - Generates a single topic based on a user query and saves it to Firebase.
 * - GenerateSingleTopicInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { saveTopicsToFirebase } from '@/lib/firebase-service';
import type { Topic } from '@/lib/curriculum';

const GenerateSingleTopicInputSchema = z.object({
  query: z.string().describe("La consulta o término de búsqueda del usuario."),
  gradeName: z.string().describe('El nombre del grado académico (ej: "Básica Primaria (1°-5°)")'),
  subjectName: z.string().describe('El nombre de la materia (ej: "Matemáticas")'),
  gradeSlug: z.string(),
  subjectSlug: z.string(),
});
export type GenerateSingleTopicInput = z.infer<typeof GenerateSingleTopicInputSchema>;

const GeneratedTopicSchema = z.object({
    name: z.string().describe("Un nombre conciso y claro para el tema, basado en la consulta del usuario. Debe reflejar el tema central."),
    description: z.string().describe("Una descripción corta (1-2 frases) de lo que cubre el tema."),
    content: z.string().describe("El contenido educativo completo del tema, en formato HTML. Debe ser detallado, bien estructurado con encabezados (<h3>, <h4>), párrafos (<p>), listas (<ul>, <li>) y texto en negrita (<strong>) para una fácil lectura y adecuado para el nivel educativo."),
});

const GenerateSingleTopicOutputSchema = z.object({
  topic: GeneratedTopicSchema,
});

export async function generateSingleTopic(input: GenerateSingleTopicInput): Promise<Topic> {
  const generatedContent = await generateSingleTopicFlow(input);
  
  const newTopic: Topic & { content: string } = {
      ...generatedContent.topic,
      slug: generatedContent.topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      progress: 0,
  };

  await saveTopicsToFirebase(input.gradeSlug, input.subjectSlug, [newTopic]);

  // Return the newly created topic so the UI can potentially use it.
  return newTopic;
}

const generateSingleTopicPrompt = ai.definePrompt({
  name: 'generateSingleTopicPrompt',
  input: { schema: GenerateSingleTopicInputSchema },
  output: { schema: GenerateSingleTopicOutputSchema },
  prompt: `Eres un experto diseñador de currículos educativos y profesor para Colombia.
  
  Tu tarea es generar un único tema educativo basado en la consulta de un usuario para la materia de '{{{subjectName}}}' en el grado '{{{gradeName}}}'.

  La consulta del usuario es: "{{{query}}}"
  
  A partir de esta consulta, debes crear un tema completo y bien estructurado.
  
  Proporciona:
  1.  Un nombre de tema que sea conciso y refleje la consulta del usuario.
  2.  Una breve descripción (1-2 frases).
  3.  El contenido educativo completo y detallado del tema en formato HTML. Este contenido debe ser apropiado para el nivel educativo, estar bien estructurado con etiquetas como <h3>, <h4>, <p>, <ul>, <li> y <strong> para resaltar términos clave. Debe ser completo y listo para ser estudiado por un alumno.
  
  Asegúrate de que la respuesta final esté en el formato JSON solicitado.`,
});

const generateSingleTopicFlow = ai.defineFlow(
  {
    name: 'generateSingleTopicFlow',
    inputSchema: GenerateSingleTopicInputSchema,
    outputSchema: GenerateSingleTopicOutputSchema,
  },
  async (input) => {
    const { output } = await generateSingleTopicPrompt(input);
    return output!;
  }
);
