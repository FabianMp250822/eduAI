import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import { ConnectivityStatus } from './connectivity-status';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-headline text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="gap-2 py-1.5 px-3">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="font-semibold">1,250 Puntos</span>
        </Badge>
        <ConnectivityStatus />
      </div>
    </header>
  );
}
