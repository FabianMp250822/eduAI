
'use client';

import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Loader, Sparkles, BookOpen, Search, FileText, BrainCircuit } from 'lucide-react';
import { useSyncStatus } from '@/hooks/use-sync';
import { addPointsForAction } from '@/lib/points';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      .replace(/<\/li><li>/gim, '</li>\n<li>') // Add newline between list items for proper spacing
      .replace(/^(<li>.*<\/li>)$/gim, '<ul>$1</ul>')
      .replace(/<\/ul>\n<ul>/gim, '')
      .replace(/\n/g, '<br />')
      .replace(/<br \/><br \/>/g, '<br />'); // Prevent double line breaks
}

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [visitedTopics, setVisitedTopics] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(gradeSlug, subjectSlug);
  const { isTopicSynced, isSyncing } = useSyncStatus();

  const aiContent = useLiveQuery(
    () => db.aiContent
            .where({ gradeSlug: gradeSlug, subjectSlug: subjectSlug })
            .sortBy('createdAt'),
    [gradeSlug, subjectSlug]
  );

  const filteredTopics = useMemo(() => {
    if (!subject) return [];
    if (!searchTerm) return subject.topics;
    return subject.topics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subject, searchTerm]);

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

  const handleTopicClick = async (topicSlug: string) => {
    if (!visitedTopics.has(topicSlug)) {
        const success = await addPointsForAction(`read_topic_${topicSlug}`, 5);
        if (success) {
            toast({
                title: "¡Puntos ganados!",
                description: "Has ganado 5 puntos por empezar un nuevo tema.",
            });
            setVisitedTopics(prev => new Set(prev).add(topicSlug));
        }
    }
  };

  const SubjectIcon = subject.icon;

  return (
    <>
      <Header title={subject.name} />
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <SubjectIcon className="h-8 w-8" />
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

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topics">
              <FileText className="mr-2 h-4 w-4" /> Temas del Currículo
            </TabsTrigger>
            <TabsTrigger value="ai-content">
              <BrainCircuit className="mr-2 h-4 w-4" /> Preguntas Guardadas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="mt-6">
            <div className="space-y-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => {
                  const isSynced = isTopicSynced(topic.slug);
                  const syncing = isSyncing(topic.slug);
                  return (
                    <Card key={topic.slug} className="transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center justify-between p-4 md:p-6">
                        <div className="flex-grow">
                          <CardTitle className="font-headline text-lg">{topic.name}</CardTitle>
                          <CardDescription className="mt-1">{topic.description}</CardDescription>
                          <div className="mt-3 flex items-center gap-3">
                            <Progress value={topic.progress} className="h-2 w-full max-w-xs" />
                            <span className="text-sm font-medium text-muted-foreground">{topic.progress}% completado</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pl-4">
                          {syncing && <Loader className="h-5 w-5 animate-spin text-muted-foreground" />}
                          {isSynced && !syncing && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          <Button variant="outline" size="sm" onClick={() => handleTopicClick(topic.slug)}>
                              Comenzar <ArrowRight className="ml-2 h-4 w-4 hidden sm:inline" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No se encontraron temas que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai-content" className="mt-6">
             {filteredAiContent && filteredAiContent.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                      <Sparkles className="text-primary" />
                      Contenido Generado por IA
                    </CardTitle>
                    <CardDescription>
                      Estas son las preguntas que has hecho y que se han guardado en esta materia.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
              ) : (
                 <div className="text-center py-16 rounded-lg border-2 border-dashed">
                    <BrainCircuit className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Sin contenido de IA todavía</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchTerm ? "No hay contenido que coincida con tu búsqueda." : "Usa la función 'Pregúntale a la IA' para generar y guardar contenido aquí."}
                    </p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link href="/dashboard/ask-ai">
                        <Sparkles className="mr-2 h-4 w-4"/>
                        Preguntar a la IA
                      </Link>
                    </Button>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
