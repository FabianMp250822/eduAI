'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateAndSaveTopics } from '@/ai/flows/generate-topics-flow';
import { curriculum } from '@/lib/curriculum';
import { Bot, Loader, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function TopicGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const { toast } = useToast();

  const handleGenerateTopics = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentTask("");

    const mathSubjects = [];
    for (const grade of curriculum) {
        const mathSubject = grade.subjects.find(s => s.name.toLowerCase().includes('matemáticas'));
        if (mathSubject) {
            mathSubjects.push({ 
                gradeName: grade.name,
                subjectName: mathSubject.name,
                gradeSlug: grade.slug,
                subjectSlug: mathSubject.slug 
            });
        }
    }
    
    if (mathSubjects.length === 0) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se encontraron asignaturas de matemáticas en el currículo.",
        });
        setIsGenerating(false);
        return;
    }

    const totalTasks = mathSubjects.length;

    for (let i = 0; i < totalTasks; i++) {
        const subjectInfo = mathSubjects[i];
        try {
            setCurrentTask(`Generando temas para ${subjectInfo.subjectName} en ${subjectInfo.gradeName}...`);
            await generateAndSaveTopics(subjectInfo);
            toast({
                title: "Éxito parcial",
                description: `Temas para ${subjectInfo.subjectName} (${subjectInfo.gradeName}) generados y guardados.`,
                className: "bg-green-100 dark:bg-green-900",
            });
        } catch (error) {
            console.error(`Error generando temas para ${subjectInfo.subjectName}:`, error);
            toast({
                variant: "destructive",
                title: "Error en Generación",
                description: `No se pudieron generar temas para ${subjectInfo.subjectName}. Revisa la consola para más detalles.`,
            });
        } finally {
            setProgress(((i + 1) / totalTasks) * 100);
        }
    }

    setCurrentTask("¡Proceso completado!");
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <Bot className="h-4 w-4" />
        <AlertTitle>¡Atención!</AlertTitle>
        <AlertDescription>
          Esta acción es intensiva y puede tardar varios minutos. Realizará múltiples llamadas a la IA y guardará los resultados en la base de datos. No recargues la página durante el proceso.
        </AlertDescription>
      </Alert>
      
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
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? 'Generando Contenido...' : 'Iniciar Generación de Temas de Matemáticas'}
        {!isGenerating && <Bot className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
}
