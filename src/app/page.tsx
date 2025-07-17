import { LicenseForm } from '@/components/license-form';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-3 text-primary">
          <GraduationCap className="h-12 w-12" />
          <h1 className="font-headline text-5xl font-bold tracking-tighter">
            EduSync AI
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md text-center">
          Welcome! Please enter your license key to begin your personalized learning journey.
        </p>
      </div>
      <div className="mt-8 w-full max-w-sm">
        <LicenseForm />
      </div>
    </main>
  );
}
