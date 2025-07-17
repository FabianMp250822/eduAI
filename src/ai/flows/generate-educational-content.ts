'use server';

/**
 * @fileOverview AI flow for generating educational content based on user queries.
 *
 * - generateEducationalContent - A function that generates educational content based on the input query.
 * - GenerateEducationalContentInput - The input type for the generateEducationalContent function.
 * - GenerateEducationalContentOutput - The return type for the generateEducationalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEducationalContentInputSchema = z.object({
  query: z.string().describe('La consulta del estudiante.'),
});

export type GenerateEducationalContentInput = z.infer<typeof GenerateEducationalContentInputSchema>;

const GenerateEducationalContentOutputSchema = z.object({
  content: z.string().describe('El contenido educativo generado.'),
});

export type GenerateEducationalContentOutput = z.infer<typeof GenerateEducationalContentOutputSchema>;

export async function generateEducationalContent(input: GenerateEducationalContentInput): Promise<GenerateEducationalContentOutput> {
  return generateEducationalContentFlow(input);
}

const generateEducationalContentPrompt = ai.definePrompt({
  name: 'generateEducationalContentPrompt',
  input: {schema: GenerateEducationalContentInputSchema},
  output: {schema: GenerateEducationalContentOutputSchema},
  prompt: `Eres un asistente de IA que genera contenido educativo en español para estudiantes desde preescolar hasta undécimo grado.

  Proporciona información relevante y alineada con el currículo escolar basada en la consulta del estudiante.

  Consulta: {{{query}}} `,
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
