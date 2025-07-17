
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarInset,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { GraduationCap, Sparkles, ChevronDown } from 'lucide-react';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/dashboard">
                    <GraduationCap className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-semibold tracking-tight">
                EduSync AI
              </h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Pregúntale a la IA">
                <Link href="/dashboard/ask-ai">
                  <Sparkles />
                  <span>Pregúntale a la IA</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {curriculum.map((grade) => {
              const GradeIcon = grade.subjects[0].icon;
              return (
                <SidebarMenuItem key={grade.slug} asChild>
                  <Collapsible>
                    <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                      <Link href={`/dashboard/${grade.slug}`} className="flex-1">
                        <SidebarMenuButton className="w-full justify-start" tooltip={grade.name}>
                          <GradeIcon />
                          <span>{grade.name}</span>
                        </SidebarMenuButton>
                      </Link>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 shrink-0 group-data-[collapsible=icon]:hidden">
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {grade.subjects.map((subject) => (
                          <SidebarMenuSubItem key={subject.slug}>
                            <SidebarMenuSubButton asChild>
                              <Link href={`/dashboard/${grade.slug}/${subject.slug}`}>
                                <subject.icon />
                                <span>{subject.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
