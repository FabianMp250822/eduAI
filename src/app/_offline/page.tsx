
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-4">
      <div className="flex flex-col items-center gap-4">
        <WifiOff className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">No tienes conexión</h1>
        <p className="text-muted-foreground max-w-sm">
          Parece que estás sin conexión. Esta página no se ha guardado localmente.
          Por favor, revisa tu conexión a internet e inténtalo de nuevo.
        </p>
      </div>
    </main>
  );
}
