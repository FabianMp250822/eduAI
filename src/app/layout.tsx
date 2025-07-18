'use client';

import { useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Metadata and viewport cannot be exported from a client component.
// This information can be configured in a parent layout or the root layout if it's a server component.

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return null;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>EduSync AI</title>
        <meta name="description" content="Plataforma educativa con IA y acceso sin conexión." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/edusync-ai-ldeq7.firebasestorage.app/o/image-removebg-preview.png?alt=media&token=4da022e6-4a05-4662-b40b-644569d3e291" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ServiceWorkerRegistrar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
