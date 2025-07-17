import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { curriculum } from '@/lib/curriculum';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <Header title="Todos los Grados" />
      <main className="p-4 sm:p-6">
        <div className="mb-6 md:mb-8">
            <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">Selecciona un Grado</h2>
            <p className="text-muted-foreground mt-1">Elige un nivel de grado para comenzar a explorar materias y temas.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {curriculum.map((grade) => {
            const GradeIcon = grade.subjects[0].icon;
            return (
              <Link href={`/dashboard/${grade.slug}`} key={grade.slug} className="group">
                <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <GradeIcon className="h-7 w-7" />
                            </div>
                            <CardTitle className="font-headline text-xl">{grade.name}</CardTitle>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{grade.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  );
}
