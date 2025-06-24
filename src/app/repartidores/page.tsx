import prisma from '@/lib/prisma';
import type { Repartidor } from '@/tipos/repartidor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Futuros componentes a crear
// import { FormularioNuevoRepartidor } from '@/components/formulario-nuevo-repartidor';
// import { TablaRepartidores } from '@/components/tabla-repartidores';

export default async function RepartidoresPage() {
  let repartidores: Repartidor[] = [];

  if (prisma) {
    try {
      repartidores = await prisma.repartidor.findMany({
        orderBy: {
          nombre: 'asc',
        },
      });
    } catch (error) {
      console.error("Error al obtener los repartidores:", error);
      // La página se renderizará con la lista vacía si hay un error.
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Repartidores
        </h1>
        {/* Este botón eventualmente activará un diálogo o formulario */}
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Repartidor
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
            {/* Marcador de posición para el componente de formulario */}
            <Card>
                <CardHeader>
                    <CardTitle>Añadir Nuevo Repartidor</CardTitle>
                    <CardDescription>
                        Completa el formulario para registrar un nuevo repartidor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">El formulario para añadir un nuevo repartidor se implementará aquí.</p>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-3">
             {/* Marcador de posición para el componente de tabla */}
             <Card>
                <CardHeader>
                    <CardTitle>Lista de Repartidores</CardTitle>
                    <CardDescription>
                        Estos son los repartidores activos en el sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">La tabla con la lista de repartidores ({repartidores.length} encontrados) se implementará aquí.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}