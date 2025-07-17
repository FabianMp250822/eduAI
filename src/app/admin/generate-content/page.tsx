import { TopicGenerator } from '@/components/admin/topic-generator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminGenerateContentPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Generación de Contenido con IA</h2>
      <Card>
        <CardHeader>
          <CardTitle>Generador de Temas</CardTitle>
          <CardDescription>
            Usa esta herramienta para generar automáticamente 5 temas iniciales para todas las asignaturas de matemáticas del currículo.
            Los temas se guardarán directamente en la base de datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopicGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
