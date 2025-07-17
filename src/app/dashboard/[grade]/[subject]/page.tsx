
'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Video, FileText, ClipboardCheck, MessageCircleQuestion } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Input } from '@/components/ui/input';

export default function SubjectPage() {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(gradeSlug, subjectSlug);

  const aiContent = useLiveQuery(
    () => db.aiContent
            .where({ gradeSlug: gradeSlug, subjectSlug: subjectSlug })
            .toArray(),
    [gradeSlug, subjectSlug]
  );
  
  if (!subject) {
    notFound();
  }
  
  const SubjectIcon = subject.icon;

  const resourceCategories = [
    { slug: 'videos', title: 'Videos Explicativos', icon: Video, count: 0, description: 'Lecciones en video para un aprendizaje visual.' },
    { slug: 'documents', title: 'Guías y Documentos', icon: FileText, count: 0, description: 'Material de lectura y guías de estudio.' },
    { slug: 'activities', title: 'Actividades y Evaluaciones', icon: ClipboardCheck, count: 0, description: 'Ejercicios prácticos y quizzes.' },
    { slug: 'ai-questions', title: 'Preguntas a la IA', icon: MessageCircleQuestion, count: aiContent?.length ?? 0, description: 'Respuestas de la IA a tus dudas guardadas.' },
  ];

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return resourceCategories;
    return resourceCategories.filter(category => 
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, resourceCategories, aiContent]);


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
            placeholder={`Buscar en las categorías de recursos...`}
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <Card key={category.slug} className="flex flex-col transition-shadow hover:shadow-lg hover:border-primary/50">
                 <Link href={`/dashboard/${gradeSlug}/${subjectSlug}/${category.slug}`} className="flex flex-col flex-grow">
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
                          <span>
                            Ver <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                      </Button>
                    </CardFooter>
                 </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No se encontraron categorías que coincidan con tu búsqueda.</p>
          </div>
        )}
      </main>
    </>
  );
}
