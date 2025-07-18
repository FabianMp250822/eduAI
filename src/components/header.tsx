import { SidebarTrigger } from '@/components/ui/sidebar';
import { ConnectivityStatus } from './connectivity-status';
import { UserPoints } from './user-points';

type HeaderProps = {
  title: string;
};

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="font-headline text-xl font-semibold tracking-tight truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <ConnectivityStatus />
        <UserPoints />
      </div>
    </header>
  );
}
