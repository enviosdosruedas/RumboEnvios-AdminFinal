import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TablaOrdenes } from '@/components/tabla-ordenes';

interface DetalleRepartoPageProps {
  params: {
    id: string;
  };
}

export default async function DetalleRepartoPage({ params }: DetalleRepartoPageProps) {
  if (!prisma) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Detalle del Reparto</h1>
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-card p-4">
          <div className="text-center">
            <p className="mt-2 text-base text-muted-foreground">
              La conexión con la base de datos no está configurada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const reparto = await prisma.reparto.findUnique({
    where: { id: params.id },
    include: {
      repartidor: true,
      ordenes: true,
    },
  });

  if (!reparto) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/repartos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver a Repartos</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          Detalle del Reparto
        </h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Resumen del reparto #{reparto.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Repartidor:</span>
              <span>{reparto.repartidor.nombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Fecha:</span>
              <span>{format(new Date(reparto.fecha), "PPP", { locale: es })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Órdenes Asignadas ({reparto.ordenes.length})
        </h2>
        {reparto.ordenes.length > 0 ? (
          <TablaOrdenes datos={reparto.ordenes} />
        ) : (
          <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed shadow-sm bg-card p-4">
            <p className="text-muted-foreground">No hay órdenes asignadas a este reparto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
