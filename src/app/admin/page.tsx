import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Bienvenido, Administrador</h2>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Contenido</CardTitle>
          <CardDescription>
            Desde aquí podrás añadir, editar y eliminar los recursos educativos de la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Próximamente, aquí encontrarás el formulario para cargar nuevo material.</p>
        </CardContent>
      </Card>
    </div>
  );
}
