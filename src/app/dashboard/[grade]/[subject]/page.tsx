
'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { findSubject } from '@/lib/curriculum';
import { Card, CardTitle, CardDescription, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Video, FileText, ClipboardCheck, MessageCircleQuestion, BookOpen, Circle, CheckCircle, Loader, Sparkles } from 'lucide-react';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db as localDb } from '@/lib/db';
import { db as firebaseDb } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import type { Topic } from '@/lib/curriculum';
import { generateSingleTopic } from '@/ai/flows/generate-single-topic-flow';
import { useToast } from '@/hooks/use-toast';


interface TopicWithId extends Topic {
  id: string;
}

export default function SubjectPage() {
  const params = useParams();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState<TopicWithId[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const generationDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;

  const subject = findSubject(gradeSlug, subjectSlug);

  const localTopicsForSubject = useLiveQuery(
    () => localDb.topics.where('subjectSlug').equals(subjectSlug).toArray(),
    [subjectSlug],
    []
  );

  useEffect(() => {
    if (!gradeSlug || !subjectSlug) return;
    
    setLoadingTopics(true);
    
    const docId = `${gradeSlug}_${subjectSlug}`;
    const subjectRef = doc(firebaseDb, 'subjects', docId);

    const unsubscribe = onSnapshot(subjectRef, (docSnap) => {
        if (docSnap.exists()) {
            const subjectData = docSnap.data();
            const fetchedTopics = (subjectData.topics || []).map((t: Topic) => ({
                ...t,
                id: t.slug,
            }));
            setTopics(fetchedTopics);
        } else {
            const formattedLocalTopics = (localTopicsForSubject || []).map(t => ({...t, id: t.slug, progress: 0}));
            setTopics(formattedLocalTopics);
        }
        setLoadingTopics(false);
    }, (error) => {
        console.warn("Offline or error fetching from Firebase, using local data.", error);
        const formattedLocalTopics = (localTopicsForSubject || []).map(t => ({...t, id: t.slug, progress: 0}));
        setTopics(formattedLocalTopics);
        setLoadingTopics(false);
    });

    return () => unsubscribe();
  }, [gradeSlug, subjectSlug, localTopicsForSubject]); 
  
  const aiContent = useLiveQuery(
    () => localDb.aiContent
            .where({ gradeSlug: gradeSlug, subjectSlug: subjectSlug })
            .toArray(),
    [gradeSlug, subjectSlug]
  );

  const filteredTopics = useMemo(() => {
    if (!topics) return [];
    if (!searchTerm) return topics;
    return topics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, topics]);

  const triggerAIGeneration = useCallback(async () => {
    if (isGenerating || !searchTerm.trim() || !subject) return;

    const query = searchTerm.trim();
    // Prevent generation if a similar topic already exists
    const similarTopicExists = topics.some(t => t.name.toLowerCase().includes(query.toLowerCase()));
    if (similarTopicExists) return;

    setIsGenerating(true);
    try {
      await generateSingleTopic({
        query: query,
        gradeName: subject.gradeName,
        subjectName: subject.name,
        gradeSlug,
        subjectSlug,
      });
      // Removed toast to make it seamless
    } catch (error) {
      console.error("Error generating topic:", error);
      toast({
        variant: "destructive",
        title: "Error de IA",
        description: "No se pudo generar el tema. Inténtalo de nuevo.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, searchTerm, subject, topics, gradeSlug, subjectSlug, toast]);

  useEffect(() => {
    if (generationDebounceTimer.current) {
      clearTimeout(generationDebounceTimer.current);
    }
    if (searchTerm.trim() && filteredTopics.length === 0 && !isGenerating) {
      generationDebounceTimer.current = setTimeout(() => {
        triggerAIGeneration();
      }, 2000); // 2-second debounce
    }
    return () => {
      if (generationDebounceTimer.current) {
        clearTimeout(generationDebounceTimer.current);
      }
    };
  }, [searchTerm, filteredTopics.length, isGenerating, triggerAIGeneration]);


  if (!subject) {
    notFound();
  }
  
  const SubjectIcon = subject.icon;

  const resourceCategories = [
    { slug: 'videos', title: 'Videos Explicativos', icon: Video, count: 0, description: 'Lecciones en video para un aprendizaje visual.' },
    { slug: 'documents', title: 'Guías y Documentos', icon: FileText, count: 0, description: 'Material de lectura y guías de estudio.' },
    { slug: 'activities', title: 'Actividades y Evaluaciones', icon: ClipboardCheck, count: 0, description: 'Ejercicios prácticos y quizzes.' },
    { slug: 'ai-questions', title: 'Preguntas a la IA', icon: MessageCircleQuestion, count: aiContent?.length ?? 0, description: 'Respuestas de la IA a tus dudas guardadas.' },
  ];
  
  const showNoResults = filteredTopics.length === 0 && !loadingTopics;

  return (
    <>
      <Header title={subject.name} />
      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                        <SubjectIcon className="h-9 w-9" />
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">{subject.name}</h2>
                       <p className="text-muted-foreground max-w-prose mt-1">{subject.description}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar en los temas de ${subject.name}...`}
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loadingTopics ? (
            <div className="text-center py-10 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Cargando temas...</span>
            </div>
        ) : filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="flex flex-col transition-shadow hover:shadow-lg hover:border-primary/50">
                 <Link href={`/dashboard/${gradeSlug}/${subjectSlug}/topic/${topic.slug}`} className="flex flex-col flex-grow p-4">
                    <CardHeader className="p-0 mb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="relative h-10 w-10">
                           <svg className="h-full w-full" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                stroke="hsl(var(--muted))"
                                strokeWidth="2"
                                fill="none"
                              />
                              <path
                                className="transition-all duration-500"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                                stroke="hsl(var(--primary))"
                                strokeWidth="2.5"
                                strokeDasharray={`${topic.progress}, 100`}
                                strokeLinecap="round"
                                fill="none"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                               {topic.progress >= 100 ? <CheckCircle className="h-5 w-5 text-primary" /> : topic.progress > 0 ? <div className="text-xs font-bold text-primary">{`${Math.round(topic.progress)}%`}</div> : <Circle className="h-5 w-5 text-muted-foreground/30" />}
                            </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <CardTitle className="font-headline text-lg mb-1">{topic.name}</CardTitle>
                      <CardDescription className="text-xs line-clamp-3">{topic.description}</CardDescription>
                    </CardContent>
                 </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/50 rounded-lg">
             {isGenerating ? (
                <>
                    <Sparkles className="mx-auto h-12 w-12 text-primary animate-pulse" />
                    <h3 className="mt-4 text-lg font-semibold">Buscando y creando...</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Estamos preparando contenido sobre "{searchTerm}".
                    </p>
                </>
            ) : (
                <>
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No se encontraron temas</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                    Intenta otra búsqueda. Si no encuentras lo que buscas, la IA lo creará para ti.
                    </p>
                </>
            )}
          </div>
        )}

        <div className="pt-8">
            <h3 className="text-xl font-bold mb-4">Otros Recursos</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                {resourceCategories.map((category) => (
                <Card key={category.slug} className="flex flex-col transition-shadow hover:shadow-lg hover:border-primary/50">
                    <Link href={`/dashboard/${gradeSlug}/${subjectSlug}/${category.slug}`} className="flex flex-col flex-grow">
                        <CardHeader>
                        <div className="flex items-center gap-3">
                            <category.icon className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline text-lg">{category.title}</CardTitle>
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <CardDescription>{category.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">{category.count} recursos</span>
                        <Button asChild variant="ghost" size="sm">
                            <span>
                                Ver <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </Button>
                        </CardFooter>
                    </Link>
                </Card>
                ))}
            </div>
        </div>
      </main>
    </>
  );
}
