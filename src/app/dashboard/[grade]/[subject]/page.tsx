
'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Search, Sparkles, Video, FileText, ClipboardCheck, MessageCircleQuestion, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

// Función para convertir un subconjunto de Markdown a HTML
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
      .replace(/<br \/>\s*<br \/>/g, '<br />'); // Prevent double line breaks
}

export default function SubjectPage() {
  const params = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(gradeSlug, subjectSlug);

  const aiContent = useLiveQuery(
    () => db.aiContent
            .where({ gradeSlug: gradeSlug, subjectSlug: subjectSlug })
            .sortBy('createdAt'),
    [gradeSlug, subjectSlug]
  );

  const filteredAiContent = useMemo(() => {
    if (!aiContent) return [];
    if (!searchTerm) return aiContent;
    return aiContent.filter(item =>
      item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [aiContent, searchTerm]);

  if (!subject) {
    notFound();
  }
  
  const SubjectIcon = subject.icon;

  const resourceCategories = [
    { slug: 'videos', title: 'Videos Explicativos', icon: Video, count: 0, description: 'Lecciones en video para un aprendizaje visual.' },
    { slug: 'documents', title: 'Guías y Documentos', icon: FileText, count: 0, description: 'Material de lectura y guías de estudio.' },
    { slug: 'activities', title: 'Actividades y Evaluaciones', icon: ClipboardCheck, count: 0, description: 'Ejercicios prácticos y quizzes.' },
    { slug: 'ai-questions', title: 'Preguntas a la IA', icon: MessageCircleQuestion, count: filteredAiContent?.length ?? 0, description: 'Respuestas de la IA a tus dudas guardadas.' },
  ];

  return (
    <>
      <Header title={subject.name} />
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                        <SubjectIcon className="h-9 w-9" />
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">{subject.name}</h2>
                       <p className="text-muted-foreground max-w-prose mt-1">{subject.description}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar en ${subject.name}...`}
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {resourceCategories.filter(c => c.slug !== 'ai-questions').map((category) => (
            <Card key={category.title} className="flex flex-col transition-shadow hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <category.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="font-headline text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">{category.count} recursos</span>
                 <Button asChild variant="ghost" size="sm" disabled={category.count === 0}>
                    <Link href={`/dashboard/${gradeSlug}/${subjectSlug}/${category.slug}`}>
                      Ver <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredAiContent && filteredAiContent.length > 0 && (
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <MessageCircleQuestion className="h-6 w-6 text-primary" />
                <h3 className="font-headline text-xl font-bold tracking-tight">
                  Preguntas a la IA
                </h3>
             </div>
            <Card>
              <CardContent className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  {filteredAiContent.map((item) => (
                    <AccordionItem value={item.id} key={item.id}>
                      <AccordionTrigger className="font-medium text-left hover:no-underline">
                         <div className="flex flex-col text-left">
                            <span className="font-normal text-muted-foreground text-xs">Pregunta:</span>
                            <span className="text-base">"{item.query}"</span>
                         </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(item.content) }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        )}
        
        {searchTerm && filteredAiContent?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No se encontró contenido que coincida con tu búsqueda.</p>
          </div>
        )}

      </main>
    </>
  );
}
