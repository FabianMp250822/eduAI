
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { curriculum, type Subject, type Topic } from '@/lib/curriculum';
import { useToast } from '@/hooks/use-toast';
import { saveTopicsToFirebase } from '@/lib/firebase-service';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Upload, FileUp, Link as LinkIcon, Save } from 'lucide-react';
import { RichTextEditor } from '@/components/ckeditor';
import { Card, CardContent } from '@/components/ui/card';

const resourceTypes = [
  { value: 'richText', label: 'Tema Completo (Texto Enriquecido)' },
  { value: 'video', label: 'Video (Próximamente)' },
  { value: 'pdf', label: 'Documento PDF (Próximamente)' },
];

const FormSchema = z.object({
  gradeSlug: z.string().min(1, 'Debes seleccionar un grado.'),
  subjectSlug: z.string().min(1, 'Debes seleccionar una materia.'),
  topicName: z.string().min(3, 'El nombre del tema debe tener al menos 3 caracteres.'),
  topicDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  resourceType: z.string().min(1, 'Debes seleccionar un tipo de recurso.'),
  topicContent: z.string().optional(),
  videoUrl: z.string().url('Introduce una URL de video válida.').optional().or(z.literal('')),
}).refine(data => {
    if (data.resourceType === 'richText') return !!data.topicContent && data.topicContent.length >= 20;
    return true; 
}, {
    message: 'Por favor, proporciona el contenido para el tema. Debe tener al menos 20 caracteres.',
    path: ['topicContent'], 
});


type FormValues = z.infer<typeof FormSchema>;

export function ContentForm() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gradeSlug: '',
      subjectSlug: '',
      topicName: '',
      topicDescription: '',
      resourceType: 'richText',
      topicContent: '',
      videoUrl: '',
    },
  });

  const resourceType = form.watch('resourceType');
  const isSubmitting = form.formState.isSubmitting;


  const handleGradeChange = (gradeSlug: string) => {
    form.setValue('gradeSlug', gradeSlug);
    form.setValue('subjectSlug', ''); // Reset subject when grade changes
    const selectedGrade = curriculum.find(g => g.slug === gradeSlug);
    setSubjects(selectedGrade ? selectedGrade.subjects : []);
  };

  async function onSubmit(data: FormValues) {
    if (data.resourceType !== 'richText') {
        toast({
            variant: "destructive",
            title: "Función no disponible",
            description: "La carga de videos y PDFs estará disponible próximamente.",
        });
        return;
    }

    const newTopic: Topic & { content: string } = {
        name: data.topicName,
        slug: data.topicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: data.topicDescription,
        progress: 0,
        content: data.topicContent || '',
    };
    
    try {
        await saveTopicsToFirebase(data.gradeSlug, data.subjectSlug, [newTopic]);
        toast({
            title: 'Contenido Guardado',
            description: `El tema "${data.topicName}" ha sido añadido exitosamente.`,
        });
        form.reset({
             gradeSlug: data.gradeSlug,
             subjectSlug: data.subjectSlug,
             topicName: '',
             topicDescription: '',
             resourceType: 'richText',
             topicContent: '',
        });
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error al guardar",
            description: "No se pudo guardar el tema en la base de datos.",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="gradeSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grado</FormLabel>
                <Select onValueChange={handleGradeChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un grado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {curriculum.map(grade => (
                      <SelectItem key={grade.slug} value={grade.slug}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subjectSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materia</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={subjects.length === 0}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una materia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.slug} value={subject.slug}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="topicName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre del Tema</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: El Ciclo del Agua" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="topicDescription"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Descripción Corta del Tema</FormLabel>
                <FormControl>
                    <Input placeholder="Una breve descripción que aparecerá en la tarjeta del tema." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
          control={form.control}
          name="resourceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Recurso</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de recurso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resourceTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} disabled={type.value !== 'richText'}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="p-4">
            <CardContent className="p-2">
                {resourceType === 'richText' && (
                    <FormField
                        control={form.control}
                        name="topicContent"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Contenido Completo del Tema</FormLabel>
                            <FormControl>
                                <RichTextEditor
                                    value={field.value ?? ''}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                             <FormDescription>
                                Escribe o pega el contenido aquí. Puedes usar las herramientas de formato.
                             </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {resourceType === 'video' && (
                  <div className="space-y-4 text-center text-muted-foreground p-8">
                     <p>La carga de videos estará disponible próximamente.</p>
                  </div>
                )}
                {resourceType === 'pdf' && (
                     <div className="space-y-4 text-center text-muted-foreground p-8">
                       <p>La carga de documentos PDF estará disponible próximamente.</p>
                     </div>
                )}
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Tema'}
                {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
        </div>
      </form>
    </Form>
  );
}
