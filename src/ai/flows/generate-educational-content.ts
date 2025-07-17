'use server';

/**
 * @fileOverview AI flow for generating and classifying educational content.
 *
 * - generateEducationalContent - Generates content and classifies it by grade and subject.
 * - GenerateEducationalContentInput - The input type for the function.
 * - GenerateEducationalContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { curriculum } from '@/lib/curriculum';

// Generar una lista de grados y materias para guiar a la IA
const gradesAndSubjects = curriculum.map(grade => ({
  grade: grade.name,
  gradeSlug: grade.slug,
  subjects: grade.subjects.map(subject => ({
    subject: subject.name,
    subjectSlug: subject.slug,
  })),
}));


const GenerateEducationalContentInputSchema = z.object({
  query: z.string().describe('La consulta del estudiante.'),
});

export type GenerateEducationalContentInput = z.infer<typeof GenerateEducationalContentInputSchema>;

const GenerateEducationalContentOutputSchema = z.object({
  content: z.string().describe('El contenido educativo generado.'),
  gradeSlug: z.string().describe('El slug del grado más relevante para esta consulta.'),
  subjectSlug: z.string().describe('El slug de la materia más relevante para esta consulta.'),
});

export type GenerateEducationalContentOutput = z.infer<typeof GenerateEducationalContentOutputSchema>;

export async function generateEducationalContent(input: GenerateEducationalContentInput): Promise<GenerateEducationalContentOutput> {
  return generateEducationalContentFlow(input);
}

const generateEducationalContentPrompt = ai.definePrompt({
  name: 'generateEducationalContentPrompt',
  input: {schema: GenerateEducationalContentInputSchema},
  output: {schema: GenerateEducationalContentOutputSchema},
  prompt: `Eres un asistente de IA que genera contenido educativo en español para estudiantes y lo clasifica.

  Primero, proporciona información relevante y alineada con el currículo escolar basada en la consulta del estudiante.
  
  Segundo, analiza la consulta y el contenido que generaste para determinar el grado y la materia más apropiados. Debes devolver los 'slugs' correspondientes de la siguiente lista.

  Lista de Grados y Materias disponibles:
  ${JSON.stringify(gradesAndSubjects, null, 2)}

  Asegúrate de que los valores de 'gradeSlug' y 'subjectSlug' en tu respuesta coincidan EXACTAMENTE con los slugs de la lista proporcionada.

  Consulta del estudiante: {{{query}}}`,
});

const generateEducationalContentFlow = ai.defineFlow(
  {
    name: 'generateEducationalContentFlow',
    inputSchema: GenerateEducationalContentInputSchema,
    outputSchema: GenerateEducationalContentOutputSchema,
  },
  async input => {
    const {output} = await generateEducationalContentPrompt(input);
    return output!;
  }
);
