
'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { GraduationCap, Sparkles, ChevronDown } from 'lucide-react';
import { curriculum } from '@/lib/curriculum';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { SyncProvider } from '@/hooks/use-sync';
import { LicenseStatus } from '@/components/license-status';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SyncProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-center p-2 group-data-[collapsible=icon]:p-0">
              <Link href="/dashboard">
                 <Image 
                    src="https://firebasestorage.googleapis.com/v0/b/edusync-ai-ldeq7.firebasestorage.app/o/image-removebg-preview.png?alt=media&token=4da022e6-4a05-4662-b40b-644569d3e291" 
                    alt="EduSync AI Logo"
                    width={150}
                    height={150}
                    className="h-16 w-auto transition-all group-data-[collapsible=icon]:h-10"
                  />
              </Link>
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
                const GradeIcon = grade.subjects[0]?.icon || GraduationCap;
                return (
                  <SidebarMenuItem key={grade.slug} asChild>
                    <Collapsible>
                       <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                          <SidebarMenuButton asChild tooltip={grade.name} className="flex-1 justify-start">
                             <Link href={`/dashboard/${grade.slug}`} >
                                <GradeIcon />
                                <span>{grade.name}</span>
                             </Link>
                          </SidebarMenuButton>
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
           <SidebarFooter>
            <Separator className="my-2" />
             <div className="flex flex-col gap-2 p-2">
                <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden">
                    <LicenseStatus />
                </div>
             </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          {children}
        </SidebarInset>
        <MobileNav />
      </SidebarProvider>
    </SyncProvider>
  );
}
