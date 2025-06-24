import { TablaOrdenes } from "@/components/tabla-ordenes";
import { Header } from "@/components/header";
import prisma from "@/lib/prisma";
import type { Orden } from "@/tipos/orden";

async function getOrdenes(): Promise<Orden[]> {
  const ordenes = await prisma.orden.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return ordenes;
}

export default async function HistorialPage() {
  const ordenes = await getOrdenes();

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Historial de Órdenes
      </h1>
      {ordenes.length > 0 ? (
        <TablaOrdenes datos={ordenes} />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-card p-4">
          <div className="text-center">
            <p className="mt-2 text-base text-muted-foreground">
              No hay órdenes guardadas en el historial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
