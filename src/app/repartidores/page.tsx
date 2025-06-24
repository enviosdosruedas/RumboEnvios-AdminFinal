import prisma from '@/lib/prisma';
import type { Repartidor } from '@/tipos/repartidor';
import { FormularioNuevoRepartidor } from '@/components/formulario-nuevo-repartidor';
import { TablaRepartidores } from '@/components/tabla-repartidores';

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
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <FormularioNuevoRepartidor />
        </div>
        <div className="lg:col-span-3">
             <TablaRepartidores data={repartidores} />
        </div>
      </div>
    </div>
  );
}
