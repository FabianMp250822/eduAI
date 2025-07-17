'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';

const FormSchema = z.object({
  licenseKey: z.string().min(1, 'La clave de licencia es obligatoria.'),
});

type FormValues = z.infer<typeof FormSchema>;

export function LicenseForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      licenseKey: '',
    },
  });

  async function onSubmit(data: FormValues) {
    if (data.licenseKey.toLowerCase() !== 'test-key') {
      toast({
        variant: "destructive",
        title: "Validación Fallida",
        description: "Clave de licencia inválida. Por favor, inténtalo de nuevo.",
      });
      return;
    }

    try {
      await signInAnonymously(auth);
      toast({
        title: "Validación Exitosa",
        description: "¡Bienvenido a EduSync AI!",
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error de autenticación anónima:", error);
      toast({
        variant: "destructive",
        title: "Error de Autenticación",
        description: "No se pudo iniciar sesión. Por favor, revisa tu conexión a Firebase.",
      });
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="licenseKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clave de Licencia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu clave de licencia" {...field} />
                  </FormControl>
                  <FormDescription>
                    Usa 'test-key' para una demostración.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Validando...' : 'Activar Licencia'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
