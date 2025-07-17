
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { findSubject, type Topic } from '@/lib/curriculum';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, BookOpen, Check, Award } from 'lucide-react';
import { addPointsForAction } from '@/lib/points';
import { useToast } from '@/hooks/use-toast';

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState<Topic | null>(null);
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

    const docId = `${gradeSlug}_${subjectSlug}`;
    const subjectRef = doc(db, 'subjects', docId);

    const unsubscribe = onSnapshot(subjectRef, (doc) => {
      if (doc.exists()) {
        const subjectData = doc.data();
        const foundTopic = subjectData.topics?.find((t: Topic) => t.slug === topicSlug);
        if (foundTopic) {
          setTopic(foundTopic);
        } else {
          setError("El tema no fue encontrado en esta materia.");
        }
      } else {
        setError("La materia no fue encontrada.");
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching topic:", err);
      setError("No se pudo cargar el tema. Verifica tu conexión.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gradeSlug, subjectSlug, topicSlug]);
  
  const handleCompleteTopic = async () => {
    if (!topic || topic.progress >= 100) return;
    
    setIsCompleting(true);
    const docId = `${gradeSlug}_${subjectSlug}`;
    const subjectRef = doc(db, 'subjects', docId);

    try {
      // Find the specific topic object to remove it from the array
      const topicToUpdate = {
        name: topic.name,
        slug: topic.slug,
        description: topic.description,
        progress: 0, // This is the old state we want to remove
      };

      // Create the new topic object with updated progress
      const updatedTopic = { ...topicToUpdate, progress: 100 };

      // Atomically remove the old topic and add the updated one
      await updateDoc(subjectRef, {
          topics: arrayRemove(topicToUpdate)
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
      
      // Update local state to reflect change immediately
      setTopic(updatedTopic);

    } catch (e) {
      console.error("Error completing topic:", e);
       toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo marcar el tema como completado. Inténtalo de nuevo.",
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
    notFound();
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
