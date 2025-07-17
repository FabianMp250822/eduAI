import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { findGrade } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

type GradePageProps = {
  params: {
    grade: string;
  };
};

export default function GradePage({ params }: GradePageProps) {
  const grade = findGrade(params.grade);

  if (!grade) {
    notFound();
  }

  return (
    <>
      <Header title={grade.name} />
      <main className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="font-headline text-2xl font-bold tracking-tight">Subjects in {grade.name}</h2>
          <p className="text-muted-foreground">{grade.description}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {grade.subjects.map((subject) => (
            <Link href={`/dashboard/${grade.slug}/${subject.slug}`} key={subject.slug} className="group">
              <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                <div className="relative h-40 w-full">
                  <Image
                    src={`https://placehold.co/600x400.png`}
                    alt={subject.name}
                    data-ai-hint={subject.imageHint}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <subject.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-xl">{subject.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{subject.description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Badge variant="secondary" className="gap-2">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{subject.topics.length} Topics</span>
                    </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
