import { LicenseForm } from '@/components/license-form';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center space-x-3 text-primary">
            <GraduationCap className="h-10 w-10 md:h-12 md:w-12" />
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl">
              EduSync AI
            </h1>
          </div>
          <p className="text-muted-foreground max-w-sm">
            ¡Bienvenido! Ingresa tu clave de licencia para comenzar tu viaje de aprendizaje personalizado.
          </p>
        </div>
        <div className="mt-8">
          <LicenseForm />
        </div>
      </div>
    </main>
  );
}
