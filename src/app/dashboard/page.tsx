import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { curriculum } from '@/lib/curriculum';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <Header title="All Grades" />
      <main className="p-4 sm:p-6">
        <div className="mb-6">
            <h2 className="font-headline text-2xl font-bold tracking-tight">Select a Grade</h2>
            <p className="text-muted-foreground">Choose a grade level to begin exploring subjects and topics.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {curriculum.map((grade) => {
            const GradeIcon = grade.subjects[0].icon;
            return (
              <Link href={`/dashboard/${grade.slug}`} key={grade.slug} className="group">
                <Card className="h-full transition-all duration-200 group-hover:border-primary group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <GradeIcon className="h-6 w-6" />
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
