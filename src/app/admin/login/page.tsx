import { AdminLoginForm } from '@/components/admin/admin-login-form';
import Image from 'next/image';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
         <div className="flex flex-col items-center space-y-4 text-center mb-8">
           <Image 
            src="https://firebasestorage.googleapis.com/v0/b/edusync-ai-ldeq7.firebasestorage.app/o/image-removebg-preview.png?alt=media&token=4da022e6-4a05-4662-b40b-644569d3e291" 
            alt="EduSync AI Logo"
            width={250}
            height={250}
            className="h-20 w-auto"
            priority
          />
          <h1 className="text-2xl font-bold">Acceso de Administrador</h1>
          <p className="text-muted-foreground">
            Inicia sesión para gestionar el contenido de la plataforma.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
