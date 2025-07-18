
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db as firebaseDb, getDoc } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { findSubject, type Topic } from '@/lib/curriculum';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, BookOpen, Check, Award } from 'lucide-react';
import { addPointsForAction } from '@/lib/points';
import { useToast } from '@/hooks/use-toast';
import { db as localDb } from '@/lib/db';
import type { DBTopic } from '@/lib/db';

interface EnrichedTopic extends Topic {
    content: string;
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState<EnrichedTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const gradeSlug = Array.isArray(params.grade) ? params.grade[0] : params.grade;
  const subjectSlug = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const topicSlug = Array.isArray(params.topicSlug) ? params.topicSlug[0] : params.topicSlug;

  const subjectInfo = findSubject(gradeSlug, subjectSlug);

  useEffect(() => {
    if (!gradeSlug || !subjectSlug || !topicSlug) {
      setError("Faltan parámetros en la URL.");
      setLoading(false);
      return;
    }

    const fetchTopic = async () => {
        setLoading(true);
        const localTopic: DBTopic | undefined = await localDb.topics.get(topicSlug);

        if (localTopic) {
            setTopic({ ...localTopic, progress: 0 }); // Placeholder progress
            setLoading(false);

            // Try to get real progress from Firebase if online
            if (navigator.onLine) {
                try {
                    const docId = `${gradeSlug}_${subjectSlug}`;
                    const subjectRef = doc(firebaseDb, 'subjects', docId);
                    const docSnap = await getDoc(subjectRef);
                    if (docSnap.exists()) {
                        const onlineTopic = docSnap.data().topics?.find((t: Topic) => t.slug === topicSlug);
                        if (onlineTopic) {
                            setTopic(prev => prev ? { ...prev, progress: onlineTopic.progress } : null);
                        }
                    }
                } catch (e) {
                    console.warn("Could not fetch progress from Firebase.", e);
                }
            }
        } else {
            setError("El tema no está disponible sin conexión. Conéctate a internet para descargarlo.");
            setLoading(false);
        }
    };

    fetchTopic();

  }, [gradeSlug, subjectSlug, topicSlug]);
  
  const handleCompleteTopic = async () => {
    if (!topic || topic.progress >= 100) return;
    
    setIsCompleting(true);
    const docId = `${gradeSlug}_${subjectSlug}`;
    const subjectRef = doc(firebaseDb, 'subjects', docId);

    try {
      const topicToUpdate = {
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        progress: 0, 
        content: topic.content,
      };
      
      const topicWithoutContent = { ...topicToUpdate };
      delete topicWithoutContent.content;

      const updatedTopic = { ...topicWithoutContent, progress: 100 };
      
      await updateDoc(subjectRef, {
          topics: arrayRemove(topicWithoutContent)
      });
      await updateDoc(subjectRef, {
          topics: arrayUnion(updatedTopic)
      });
      
      const pointsAwarded = await addPointsForAction(`complete_topic_${topic.slug}`, 25);
      
      if (pointsAwarded) {
         toast({
          title: "¡Tema Completado!",
          description: "¡Has ganado 25 puntos por completar un tema! Sigue así.",
        });
      } else {
         toast({
          title: "¡Tema Completado!",
          description: "Ya habías completado este tema antes. ¡Buen trabajo repasando!",
        });
      }
      
      setTopic(prev => prev ? { ...prev, progress: 100 } : null);

    } catch (e) {
      console.error("Error completing topic:", e);
       toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo marcar el tema como completado. Inténtalo de nuevo cuando tengas conexión.",
      });
    } finally {
      setIsCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !topic || !subjectInfo) {
    return (
        <>
            <Header title="Error" />
            <main className="p-4 sm:p-6 lg:p-8">
                <Card className="mx-auto max-w-4xl text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">No se pudo cargar el contenido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{error || "El tema que buscas no está disponible."}</p>
                    </CardContent>
                     <CardFooter>
                        <Button onClick={() => router.back()} className="mx-auto">
                            Volver
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </>
    );
  }

  const isCompleted = topic.progress >= 100;

  return (
    <>
      <Header title={subjectInfo.name} />
      <main className="p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-4xl">
            <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                        <BookOpen className="h-9 w-9" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-2xl md:text-3xl">{topic.name}</CardTitle>
                        <CardDescription className="mt-1">{topic.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div 
                    className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-headline"
                    dangerouslySetInnerHTML={{ __html: topic.content || "<p>Este tema aún no tiene contenido.</p>" }} 
                />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button onClick={() => router.back()}>
                    Volver a la lista de temas
                </Button>
                <Button 
                    onClick={handleCompleteTopic}
                    disabled={isCompleted || isCompleting}
                    variant={isCompleted ? "secondary" : "default"}
                    className="transition-all"
                >
                    {isCompleting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : isCompleted ? <Check className="mr-2 h-4 w-4" /> : <Award className="mr-2 h-4 w-4" />}
                    {isCompleting ? "Marcando..." : isCompleted ? "Completado" : "Marcar como Completado"}
                </Button>
            </CardFooter>
        </Card>
      </main>
    </>
  );
}
