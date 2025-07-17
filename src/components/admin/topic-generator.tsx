
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateAndSaveTopics } from '@/ai/flows/generate-topics-flow';
import { curriculum } from '@/lib/curriculum';
import { Bot, Loader, CheckCircle, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';

interface SubjectInfo {
  gradeName: string;
  subjectName: string;
  gradeSlug: string;
  subjectSlug: string;
  id: string;
}

export function TopicGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const allSubjects: SubjectInfo[] = curriculum.flatMap(grade =>
    grade.subjects.map(subject => ({
      gradeName: grade.name,
      subjectName: subject.name,
      gradeSlug: grade.slug,
      subjectSlug: subject.slug,
      id: `${grade.slug}-${subject.slug}`,
    }))
  );

  const handleToggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(subjectId)) {
        newSelection.delete(subjectId);
      } else {
        newSelection.add(subjectId);
      }
      return newSelection;
    });
  };

  const handleGenerateTopics = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentTask("");

    const subjectsToGenerate = allSubjects.filter(s => selectedSubjects.has(s.id));

    if (subjectsToGenerate.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay selección",
        description: "Por favor, selecciona al menos una asignatura para generar contenido.",
      });
      setIsGenerating(false);
      return;
    }

    const totalTasks = subjectsToGenerate.length;

    for (let i = 0; i < totalTasks; i++) {
      const subjectInfo = subjectsToGenerate[i];
      setCurrentTask(`Generando 5 temas para ${subjectInfo.subjectName} en ${subjectInfo.gradeName}...`);

      try {
        await generateAndSaveTopics(subjectInfo);
        toast({
          title: "Éxito en Generación",
          description: `5 nuevos temas para ${subjectInfo.subjectName} (${subjectInfo.gradeName}) han sido generados y guardados.`,
          className: "bg-green-100 dark:bg-green-900",
        });
      } catch (error) {
        console.error(`Error generando temas para ${subjectInfo.subjectName}:`, error);
        toast({
          variant: "destructive",
          title: "Error en Generación",
          description: `No se pudieron generar temas para ${subjectInfo.subjectName}. Revisa la consola para más detalles.`,
        });
      }
      setProgress(((i + 1) / totalTasks) * 100);
    }

    setCurrentTask("¡Proceso completado!");
    setIsGenerating(false);
    setSelectedSubjects(new Set()); // Clear selection after completion
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Bot className="h-4 w-4" />
        <AlertTitle>¡Atención!</AlertTitle>
        <AlertDescription>
          Selecciona las asignaturas para las que deseas generar 5 temas adicionales. Esta acción puede tardar varios minutos y realizará llamadas a la IA y guardará los resultados en la base de datos.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Selección de Asignaturas</CardTitle>
          <CardDescription>
            Marca las casillas de las asignaturas para las que quieres crear nuevo contenido.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {curriculum.map(grade => (
              <AccordionItem value={grade.slug} key={grade.slug}>
                <AccordionTrigger className="font-semibold">{grade.name}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {grade.subjects.map(subject => {
                      const subjectId = `${grade.slug}-${subject.slug}`;
                      return (
                        <div key={subjectId} className="flex items-center space-x-2">
                          <Checkbox
                            id={subjectId}
                            checked={selectedSubjects.has(subjectId)}
                            onCheckedChange={() => handleToggleSubject(subjectId)}
                            disabled={isGenerating}
                          />
                          <Label
                            htmlFor={subjectId}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {subject.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {isGenerating && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground flex items-center justify-center">
            {progress < 100 ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
            {currentTask}
          </p>
        </div>
      )}

      <Button
        onClick={handleGenerateTopics}
        disabled={isGenerating || selectedSubjects.size === 0}
        className="w-full"
      >
        {isGenerating ? 'Generando Contenido...' : `Generar Temas para ${selectedSubjects.size} Asignatura(s)`}
        {!isGenerating && <Bot className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
