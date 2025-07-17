
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { curriculum, type Subject } from '@/lib/curriculum';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Upload, FileUp, Link as LinkIcon } from 'lucide-react';
import { TinyMceEditor } from '@/components/tinymce-editor';
import { Card, CardContent } from '@/components/ui/card';

const resourceTypes = [
  { value: 'richText', label: 'Texto Enriquecido' },
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'Documento PDF' },
];

const FormSchema = z.object({
  gradeSlug: z.string().min(1, 'Debes seleccionar un grado.'),
  subjectSlug: z.string().min(1, 'Debes seleccionar una materia.'),
  topicName: z.string().min(3, 'El nombre del tema debe tener al menos 3 caracteres.'),
  resourceType: z.string().min(1, 'Debes seleccionar un tipo de recurso.'),
  topicContent: z.string().optional(),
  videoUrl: z.string().url('Introduce una URL de video válida.').optional().or(z.literal('')),
  videoFile: z.any().optional(),
  pdfFile: z.any().optional(),
}).refine(data => {
    if (data.resourceType === 'richText') return !!data.topicContent && data.topicContent.length >= 20;
    if (data.resourceType === 'video') return !!data.videoUrl || !!data.videoFile;
    if (data.resourceType === 'pdf') return !!data.pdfFile;
    return false;
}, {
    message: 'Por favor, proporciona el contenido requerido para el tipo de recurso seleccionado.',
    path: ['topicContent'], // You can adjust the path to point to a more general location if needed
});


type FormValues = z.infer<typeof FormSchema>;

export function ContentForm() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gradeSlug: '',
      subjectSlug: '',
      topicName: '',
      resourceType: 'richText',
      topicContent: '',
      videoUrl: '',
    },
  });

  const resourceType = form.watch('resourceType');

  const handleGradeChange = (gradeSlug: string) => {
    form.setValue('gradeSlug', gradeSlug);
    form.setValue('subjectSlug', ''); // Reset subject when grade changes
    const selectedGrade = curriculum.find(g => g.slug === gradeSlug);
    setSubjects(selectedGrade ? selectedGrade.subjects : []);
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    console.log('Form data submitted:', data);
    
    // Here you would add logic to upload files to Firebase Storage
    // and then save the resulting URL/content to your database.
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Contenido Guardado',
      description: `El recurso "${data.topicName}" ha sido añadido exitosamente.`,
    });
    
    form.reset();
    setSubjects([]);
    setIsSubmitting(false);
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
                <FormLabel>Nombre del Tema / Recurso</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: El Ciclo del Agua" {...field} />
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
                    <SelectItem key={type.value} value={type.value}>
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
                            <FormLabel>Contenido del Tema</FormLabel>
                            <FormControl>
                                <TinyMceEditor
                                    value={field.value ?? ''}
                                    onEditorChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {resourceType === 'video' && (
                  <div className="space-y-4">
                     <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL del Video (YouTube, Vimeo)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="pl-10" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                     />
                     <div className="relative flex items-center justify-center">
                        <div className="flex-grow border-t"></div>
                        <span className="flex-shrink mx-4 text-muted-foreground text-xs">O</span>
                        <div className="flex-grow border-t"></div>
                     </div>
                      <FormField
                          control={form.control}
                          name="videoFile"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                              <FormLabel>Subir archivo de video</FormLabel>
                              <FormControl>
                                 <Button type="button" variant="outline" onClick={() => alert('Función de carga de video próximamente!')}>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Seleccionar Video
                                 </Button>
                              </FormControl>
                              <FormDescription>Sube un archivo de video directamente (MP4, etc.)</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                      />
                  </div>
                )}
                {resourceType === 'pdf' && (
                     <FormField
                        control={form.control}
                        name="pdfFile"
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                            <FormLabel>Subir documento PDF</FormLabel>
                            <FormControl>
                                <Button type="button" variant="outline" onClick={() => alert('Función de carga de PDF próximamente!')}>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Seleccionar PDF
                                </Button>
                            </FormControl>
                             <FormDescription>Sube un archivo en formato PDF.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                )}
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Contenido'}
                {!isSubmitting && <Upload className="ml-2 h-4 w-4" />}
            </Button>
        </div>
      </form>
    </Form>
  );
}
