
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, User, Calendar, Truck, Package, Home, Building, DollarSign, Notebook } from 'lucide-react';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Orden, EstadoOrden } from '@/tipos/orden';

interface DetalleOrdenPageProps {
  params: {
    id: string; // This will be the numeroOrden
  };
}

const getStatusBadgeVariant = (estado?: EstadoOrden): "default" | "secondary" | "destructive" | "outline" => {
    switch (estado) {
        case 'PENDIENTE': return 'secondary';
        case 'ASIGNADO': return 'default';
        case 'RETIRADO': return 'default';
        case 'EN_CAMINO': return 'default';
        case 'COMPLETADO': return 'outline';
        case 'FALLIDO': return 'destructive';
        default: return 'secondary';
      }
}

const formatStatusText = (estado?: EstadoOrden): string => {
    if (!estado) return "desconocido";
    return estado.toLowerCase().replace('_', ' ');
}


export default async function DetalleOrdenPage({ params }: DetalleOrdenPageProps) {
  if (!prisma) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-6">Detalle de la Orden</h1>
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-card p-4">
            <div className="text-center">
                <p className="mt-2 text-base text-muted-foreground">
                La conexión con la base de datos no está configurada.
                </p>
            </div>
            </div>
      </div>
    )
  }

  const orden = await prisma.orden.findUnique({
    where: { numeroOrden: params.id },
    include: {
      reparto: {
        include: {
          repartidor: true,
        },
      },
    },
  });

  if (!orden) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
            <Link href="/historial">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Volver al Historial</span>
            </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Detalle de la Orden
                </h1>
                <p className="text-sm text-muted-foreground">
                    #{orden.numeroOrden}
                </p>
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Entrega</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Home className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">{orden.destino.split(',')[0]}</p>
                                <p className="text-sm text-muted-foreground">{orden.destino}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <User className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">Cliente: {orden.nombreClienteEntrega}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">Horario de Entrega</p>
                                <p className="text-sm text-muted-foreground">{orden.horaDesde} - {orden.horaHasta}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Información de Retiro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-start gap-4">
                            <Building className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">{orden.direccionRetiro.split(',')[0]}</p>
                                <p className="text-sm text-muted-foreground">{orden.direccionRetiro}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <User className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">Punto de Retiro: {orden.nombreClienteRetiro}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalles Adicionales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-start gap-4">
                            <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">Valores</p>
                                <p className="text-sm text-muted-foreground">
                                    Total a cobrar: ${orden.total} | Costo del envío: ${orden.montoEnvio}
                                </p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Notebook className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-semibold">Aclaraciones</p>
                                <p className="text-sm text-muted-foreground">{orden.aclaraciones || 'Sin aclaraciones.'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="lg:col-span-1">
                <Card className="lg:sticky lg:top-24">
                    <CardHeader>
                        <CardTitle>Estado Actual</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Estado</span>
                             <Badge variant={getStatusBadgeVariant(orden.estado)} className="capitalize text-sm">
                                {formatStatusText(orden.estado)}
                            </Badge>
                        </div>
                        <Separator />
                        {orden.reparto ? (
                            <div className="space-y-4">
                                <h3 className="font-semibold">Asignado a Reparto</h3>
                                <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                    <Link href={`/repartos/${orden.reparto.id}`} className="text-sm hover:underline">
                                        Ver Reparto #{orden.reparto.id.substring(0, 8)}...
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{orden.reparto.repartidor.nombre}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{format(new Date(orden.reparto.fecha), "PPP", { locale: es })}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-4">
                                <Package className="h-8 w-8 mx-auto mb-2" />
                                Esta orden aún no ha sido asignada a un reparto.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    </div>
  );
}
