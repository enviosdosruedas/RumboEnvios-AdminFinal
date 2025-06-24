import prisma from '@/lib/prisma';
import { GestionRepartos } from '@/components/gestion-repartos';
import { ListaRepartos } from '@/components/lista-repartos';
import { Separator } from '@/components/ui/separator';
import type { Repartidor } from '@/tipos/repartidor';
import type { Orden } from '@/tipos/orden';
import type { RepartoExtendido } from '@/tipos/reparto';

export default async function RepartosPage() {
  let repartidores: Repartidor[] = [];
  let ordenesPendientes: Orden[] = [];
  let repartosActuales: RepartoExtendido[] = [];

  try {
    repartidores = await prisma.repartidor.findMany();
    ordenesPendientes = await prisma.orden.findMany({
      where: { estado: 'PENDIENTE', repartoId: null },
      orderBy: { fecha: 'asc' },
    });
    repartosActuales = (await prisma.reparto.findMany({
      include: {
        repartidor: true,
        _count: {
          select: { ordenes: true },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    })) as RepartoExtendido[];
  } catch (error) {
    console.error(
      'Error al obtener los datos para la página de repartos:',
      error
    );
    // La página se renderizará con los arrays vacíos.
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Gestión de Repartos
      </h1>
      <GestionRepartos
        repartidores={repartidores}
        ordenesPendientes={ordenesPendientes}
      />

      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          Historial de Repartos
        </h2>
        <ListaRepartos repartos={repartosActuales} />
      </div>
    </div>
  );
}
