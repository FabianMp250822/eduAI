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
              <SidebarMenuButton asChild tooltip="Ask AI a question">
                <Link href="/dashboard/ask-ai">
                  <Sparkles />
                  <span>Ask the AI</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {curriculum.map((grade) => (
              <SidebarMenuItem key={grade.slug} asChild>
                <Collapsible>
                  <div className="flex w-full items-center justify-between group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton asChild className="flex-1" tooltip={grade.name}>
                        <Link href={`/dashboard/${grade.slug}`}>
                            <grade.subjects[0].icon />
                            <span>{grade.name}</span>
                        </Link>
                    </SidebarMenuButton>
                    <CollapsibleTrigger asChild>
                       <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden h-8 w-8 shrink-0">
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
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
