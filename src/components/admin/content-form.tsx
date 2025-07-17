
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
import { Upload } from 'lucide-react';
import { RichTextEditor } from '@/components/rich-text-editor';

const FormSchema = z.object({
  gradeSlug: z.string().min(1, 'Debes seleccionar un grado.'),
  subjectSlug: z.string().min(1, 'Debes seleccionar una materia.'),
  topicName: z.string().min(3, 'El nombre del tema debe tener al menos 3 caracteres.'),
  topicContent: z.string().min(20, 'El contenido debe tener al menos 20 caracteres.'),
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
      topicContent: '',
    },
  });

  const handleGradeChange = (gradeSlug: string) => {
    form.setValue('gradeSlug', gradeSlug);
    form.setValue('subjectSlug', ''); // Reset subject when grade changes
    const selectedGrade = curriculum.find(g => g.slug === gradeSlug);
    setSubjects(selectedGrade ? selectedGrade.subjects : []);
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    console.log('Form data submitted:', data);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Contenido Creado',
      description: `El tema "${data.topicName}" ha sido añadido exitosamente.`,
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
            name="topicContent"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Contenido del Tema</FormLabel>
                <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Escribe el contenido aquí. Puedes pegar desde Word..."
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />

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
