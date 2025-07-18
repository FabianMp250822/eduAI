import type {Metadata} from 'next';
import './globals.css';
import { useServiceWorker } from "@/hooks/use-service-worker";
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'EduSync AI',
  description: 'Plataforma educativa con IA y acceso sin conexión.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useServiceWorker();
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/edusync-ai-ldeq7.firebasestorage.app/o/image-removebg-preview.png?alt=media&token=4da022e6-4a05-4662-b40b-644569d3e291" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
