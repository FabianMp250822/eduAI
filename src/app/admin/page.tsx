import { ContentForm } from '@/components/admin/content-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bienvenido, Administrador</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Contenido</CardTitle>
          <CardDescription>
            Utiliza este formulario para añadir nuevos temas a las asignaturas de la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentForm />
        </CardContent>
      </Card>
    </div>
  );
}
