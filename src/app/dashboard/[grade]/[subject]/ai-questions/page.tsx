
'use client';

import { useParams, notFound } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircleQuestion, AlertTriangle } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function markdownToHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\s*[-*]\s(.*$)/gim, '<li>$1</li>')
    .replace(/<\/li><li>/gim, '</li>\n<li>')
    .replace(/^(<li>.*<\/li>)$/gim, '<ul class="list-disc pl-5 mb-4">$1</ul>')
    .replace(/<\/ul>\n<ul>/gim, '')
    .replace(/\n/g, '<br />')
    .replace(/<br \/>\s*<br \/>/g, '<br />');
}

export default function AiQuestionsPage() {
  const params = useParams();
  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(gradeSlug, subjectSlug);

  const aiContent = useLiveQuery(
    () => db.aiContent
            .where({ gradeSlug: gradeSlug, subjectSlug: subjectSlug })
            .reverse() // Sort by newest first
            .sortBy('createdAt'),
    [gradeSlug, subjectSlug],
    []
  );

  if (!subject) {
    notFound();
  }

  return (
    <>
      <Header title="Preguntas a la IA" />
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <MessageCircleQuestion className="h-9 w-9" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">Preguntas a la IA</h2>
            <p className="text-muted-foreground max-w-prose mt-1">
              Aquí puedes encontrar todas las respuestas que has recibido de nuestro asistente de IA para la materia de {subject.name}.
            </p>
          </div>
        </div>

        {aiContent && aiContent.length > 0 ? (
          <div className="space-y-4">
            {aiContent.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">"{item.query}"</CardTitle>
                  <CardDescription>
                    Preguntado el {format(item.createdAt, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="font-semibold">Aún no hay preguntas</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  No has hecho ninguna pregunta a la IA para esta materia. ¡Usa el asistente para empezar a aprender!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
