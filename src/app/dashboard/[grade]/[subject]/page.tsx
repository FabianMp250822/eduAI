
'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Loader } from 'lucide-react';
import { useSyncStatus } from '@/hooks/use-sync';

export default function SubjectPage() {
  const params = useParams();
  const grade = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(grade, subjectSlug);
  const { isTopicSynced, isSyncing } = useSyncStatus();

  if (!subject) {
    notFound();
  }

  const SubjectIcon = subject.icon;

  return (
    <>
      <Header title={subject.name} />
      <main className="p-4 sm:p-6 lg:p-8">
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
                    <Button variant="outline" size="sm" asChild>
                       <Link href="#">
                          Comenzar <ArrowRight className="ml-2 h-4 w-4 hidden sm:inline" />
                       </Link>
                     </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
