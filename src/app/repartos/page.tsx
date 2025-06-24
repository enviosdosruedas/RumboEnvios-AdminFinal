import prisma from '@/lib/prisma';
import type { Repartidor } from '@/tipos/repartidor';
import type { Orden } from '@/tipos/orden';
import { CrearRepartoForm } from '@/components/crear-reparto-form';
import { OrdenesDisponiblesTabla } from '@/components/ordenes-disponibles-tabla';

async function getRepartidores(): Promise<Repartidor[]> {
  const repartidores = await prisma.repartidor.findMany();
  return repartidores;
}

async function getOrdenesPendientes(): Promise<Orden[]> {
  const ordenes = await prisma.orden.findMany({
    where: {
      estado: 'PENDIENTE',
      repartoId: null,
    },
    orderBy: {
      fecha: 'asc',
    },
  });
  return ordenes;
}

export default async function RepartosPage() {
  const [repartidores, ordenesPendientes] = await Promise.all([
    getRepartidores(),
    getOrdenesPendientes(),
  ]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Gestión de Repartos
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2 w-full lg:sticky lg:top-24">
          <CrearRepartoForm repartidores={repartidores} />
        </div>
        <div className="lg:col-span-3 w-full">
            <OrdenesDisponiblesTabla ordenes={ordenesPendientes} />
        </div>
      </div>
    </div>
  );
}
