import prisma from '@/lib/prisma';
import type { Repartidor } from '@/tipos/repartidor';
import type { Orden } from '@/tipos/orden';
import { GestionRepartos } from '@/components/gestion-repartos';

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
      <GestionRepartos 
        repartidores={repartidores}
        ordenesPendientes={ordenesPendientes}
      />
    </div>
  );
}
