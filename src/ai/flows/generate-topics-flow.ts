
'use server';

/**
 * @fileOverview AI flow for generating curriculum topics.
 *
 * - generateAndSaveTopics - Generates topics for a subject and saves them to Firebase.
 * - GenerateTopicsInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { saveTopicsToFirebase } from '@/lib/firebase-service';

const GenerateTopicsInputSchema = z.object({
  gradeName: z.string().describe('El nombre del grado académico (ej: "Básica Primaria (1°-5°)")'),
  subjectName: z.string().describe('El nombre de la materia (ej: "Matemáticas")'),
  gradeSlug: z.string(),
  subjectSlug: z.string(),
});
export type GenerateTopicsInput = z.infer<typeof GenerateTopicsInputSchema>;

const TopicSchema = z.object({
    name: z.string().describe("El nombre del tema, debe ser conciso y claro."),
    description: z.string().describe("Una descripción corta (1-2 frases) de lo que cubre el tema."),
    content: z.string().describe("El contenido educativo completo del tema, en formato HTML. Debe ser detallado, bien estructurado con encabezados (<h3>, <h4>), párrafos (<p>), listas (<ul>, <li>) y texto en negrita (<strong>) para una fácil lectura."),
});

const GenerateTopicsOutputSchema = z.object({
  topics: z.array(TopicSchema).length(5).describe("Una lista de exactamente 5 temas generados."),
});

export async function generateAndSaveTopics(input: GenerateTopicsInput): Promise<void> {
  const generatedContent = await generateTopicsFlow(input);
  if (generatedContent.topics && generatedContent.topics.length > 0) {
      const topicsToSave = generatedContent.topics.map(t => ({
          ...t,
          slug: t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          progress: 0,
      }));
      await saveTopicsToFirebase(input.gradeSlug, input.subjectSlug, topicsToSave);
  }
}

const generateTopicsPrompt = ai.definePrompt({
  name: 'generateTopicsPrompt',
  input: { schema: GenerateTopicsInputSchema },
  output: { schema: GenerateTopicsOutputSchema },
  prompt: `Eres un experto diseñador de currículos educativos y profesor para Colombia.
  
  Tu tarea es generar 5 temas adicionales o más avanzados para la materia de '{{{subjectName}}}' en el grado '{{{gradeName}}}'. Evita generar temas básicos que probablemente ya existan.
  
  Para cada tema, proporciona:
  1.  Un nombre conciso y claro.
  2.  Una breve descripción (1-2 frases).
  3.  El contenido educativo completo y detallado del tema en formato HTML. Este contenido debe ser apropiado para el nivel educativo, estar bien estructurado con etiquetas como <h3>, <h4>, <p>, <ul>, <li> y <strong> para resaltar términos clave. Debe ser completo y listo para ser estudiado por un alumno.

  Genera exactamente 5 temas. Asegúrate de que el contenido sea novedoso y no una repetición de conceptos elementales.`,
});

const generateTopicsFlow = ai.defineFlow(
  {
    name: 'generateTopicsFlow',
    inputSchema: GenerateTopicsInputSchema,
    outputSchema: GenerateTopicsOutputSchema,
  },
  async (input) => {
    const { output } = await generateTopicsPrompt(input);
    return output!;
  }
);
