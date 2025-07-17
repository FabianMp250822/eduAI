
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Sparkles, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: 'Inicio',
    },
    {
      href: '/dashboard/ask-ai',
      icon: Sparkles,
      label: 'Preguntar IA',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm lg:hidden">
      <div className="container mx-auto flex h-16 max-w-md items-center justify-around">
        <Button
          variant="ghost"
          className="flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none px-2 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-xs">Atrás</span>
        </Button>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none px-2 text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
