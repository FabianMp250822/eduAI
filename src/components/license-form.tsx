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

const FormSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required.'),
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
    // Placeholder for actual Firebase license validation
    // and anonymous sign-in.
    console.log('Validating license key:', data.licenseKey);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a successful validation
    if (data.licenseKey.toLowerCase() === 'test-key') {
      toast({
        title: "Validation Successful",
        description: "Welcome to EduSync AI!",
      });
      // On success, redirect to the dashboard
      router.push('/dashboard');
    } else {
       toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Invalid license key. Please try again.",
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
                  <FormLabel>License Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your license key" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use 'test-key' for a demo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Validating...' : 'Activate License'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
