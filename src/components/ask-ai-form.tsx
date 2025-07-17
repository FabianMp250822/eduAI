'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateEducationalContent, GenerateEducationalContentOutput } from '@/ai/flows/generate-educational-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import { addPointsForAction } from '@/lib/points';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { db as firebaseDb } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


const FormSchema = z.object({
  query: z.string().min(10, 'Por favor, introduce una consulta de al menos 10 caracteres.'),
});

type FormValues = z.infer<typeof FormSchema>;

export function AskAiForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateEducationalContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: '',
    },
  });

  const saveAiContent = async (query: string, response: GenerateEducationalContentOutput) => {
      const id = `ai_${Date.now()}`;
      const licenseKey = localStorage.getItem('licenseKey');
       if (!licenseKey) return;

      const newContent = {
        id,
        licenseKey,
        query,
        content: response.content,
        gradeSlug: response.gradeSlug,
        subjectSlug: response.subjectSlug,
        createdAt: new Date(),
      };

      try {
        await db.aiContent.put(newContent);
        console.log('Contenido de IA guardado localmente.');
      } catch (e) {
        console.error("Error al guardar en la base de datos local:", e);
      }

      if (navigator.onLine) {
        try {
            const docRef = doc(firebaseDb, `ai_content`, id);
            await setDoc(docRef, {
                ...newContent,
                syncedAt: serverTimestamp(),
            });
            console.log('Contenido de IA sincronizado con Firebase.');
        } catch(e) {
            console.error("Error al sincronizar con Firebase:", e);
        }
      }
  };


  async function onSubmit(data: FormValues) {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await generateEducationalContent({ query: data.query });
      setResult(response);
      
      await saveAiContent(data.query, response);

      const success = await addPointsForAction(`ask_ai_${Date.now()}`, 10);
      if (success) {
        toast({
          title: "¡Puntos ganados!",
          description: "Has ganado 10 puntos por usar el asistente de IA.",
        });
      }
    } catch (e) {
      setError('Ocurrió un error al generar el contenido. Por favor, inténtalo de nuevo.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Pregúntale a la IA</CardTitle>
          <CardDescription>
            ¿Tienes una pregunta? Pide ayuda a nuestro asistente de IA sobre cualquier materia desde preescolar hasta undécimo grado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu Pregunta</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Por ejemplo: 'Explica el ciclo del agua para un estudiante de tercer grado.'"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Generando...' : 'Generar Contenido'}
                {!loading && <Sparkles className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive font-headline">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Sparkles className="text-primary" />
              Contenido Generado por IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: result.content.replace(/\n/g, '<br />') }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
