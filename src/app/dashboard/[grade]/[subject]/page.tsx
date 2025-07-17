
'use client';

import Link from 'next/link';
import { useParams, notFound, useRouter } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Card, CardTitle, CardDescription, CardContent, CardHeader } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Loader, Sparkles } from 'lucide-react';
import { useSyncStatus } from '@/hooks/use-sync';
import { addPointsForAction } from '@/lib/points';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [visitedTopics, setVisitedTopics] = useState<Set<string>>(new Set());

  const grade = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(grade, subjectSlug);
  const { isTopicSynced, isSyncing } = useSyncStatus();

  const aiContent = useLiveQuery(
    () => db.aiContent
            .where({ gradeSlug: grade, subjectSlug: subjectSlug })
            .sortBy('createdAt'),
    [grade, subjectSlug]
  );

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
        <div>
          <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <SubjectIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">{subject.name}</h2>
                         <p className="text-muted-foreground max-w-prose mt-1">{subject.description}</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
            {subject.topics.map((topic) => {
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
            })}
          </div>
        </div>

        {aiContent && aiContent.length > 0 && (
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
                {aiContent.map((item) => (
                  <AccordionItem value={item.id} key={item.id}>
                    <AccordionTrigger className="font-medium text-left">"{item.query}"</AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
