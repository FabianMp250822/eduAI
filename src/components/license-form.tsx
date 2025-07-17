
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
import { db } from '@/lib/firebase';
import { doc, runTransaction } from "firebase/firestore";

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
    const { licenseKey } = data;
    const licenseRef = doc(db, "licenses", licenseKey);

    try {
      await runTransaction(db, async (transaction) => {
        const licenseDoc = await transaction.get(licenseRef);

        if (!licenseDoc.exists()) {
          throw new Error("Clave de licencia inválida.");
        }

        const licenseData = licenseDoc.data();
        
        if (licenseData.status !== 'active') {
          throw new Error("La licencia no está activa.");
        }

        const currentInstalls = licenseData.currentInstalls || 0;
        const maxInstalls = licenseData.maxInstalls || 1;

        if (currentInstalls >= maxInstalls) {
          throw new Error("Se ha alcanzado el número máximo de instalaciones para esta licencia.");
        }
        
        transaction.update(licenseRef, { currentInstalls: currentInstalls + 1 });
      });
      
      toast({
        title: "Validación Exitosa",
        description: "¡Bienvenido a EduSync AI!",
      });
      
      localStorage.setItem('licenseKey', licenseKey);

      router.push('/dashboard');

    } catch (error: any) {
      console.error("Error de validación de licencia:", error);
      toast({
        variant: "destructive",
        title: "Validación Fallida",
        description: error.message || "No se pudo validar la licencia. Por favor, inténtalo de nuevo.",
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
                    Pide tu clave a tu proveedor educativo.
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
