
'use client';

import { useParams, notFound } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, FileText, ClipboardCheck, AlertTriangle } from 'lucide-react';

const categoryDetails: Record<string, { title: string; icon: React.ElementType; description: string }> = {
  videos: {
    title: 'Videos Explicativos',
    icon: Video,
    description: 'Recursos audiovisuales para reforzar tu aprendizaje.',
  },
  documents: {
    title: 'Guías y Documentos',
    icon: FileText,
    description: 'Material de lectura, resúmenes y guías de estudio.',
  },
  activities: {
    title: 'Actividades y Evaluaciones',
    icon: ClipboardCheck,
    description: 'Ejercicios prácticos, quizzes y evaluaciones para medir tu progreso.',
  },
};

export default function ResourceCategoryPage() {
  const params = useParams();
  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category;

  const subject = findSubject(gradeSlug, subjectSlug);
  const category = categoryDetails[categorySlug];

  if (!subject || !category) {
    notFound();
  }

  const CategoryIcon = category.icon;

  return (
    <>
      <Header title={category.title} />
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <CategoryIcon className="h-9 w-9" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">{category.title}</h2>
            <p className="text-muted-foreground max-w-prose mt-1">{category.description}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold">Contenido en preparación</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Los recursos para esta sección estarán disponibles próximamente. ¡Estamos trabajando para ofrecerte el mejor material de estudio!
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
