import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Package, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { RepartoExtendido } from "@/tipos/reparto";

interface ListaRepartosProps {
  repartos: RepartoExtendido[];
}

export function ListaRepartos({ repartos }: ListaRepartosProps) {
  if (repartos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed shadow-sm bg-card p-4">
        <div className="text-center">
          <p className="mt-2 text-base text-muted-foreground">
            No hay repartos creados o no se pudo conectar a la base de datos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {repartos.map((reparto) => (
        <Card key={reparto.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
          <div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{format(new Date(reparto.fecha), "PPP", { locale: es })}</span>
              </CardTitle>
              <CardDescription>ID: {reparto.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Repartidor:</span>
                <span>{reparto.repartidor.nombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Órdenes:</span>
                <span>{reparto._count.ordenes}</span>
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4">
            <Button asChild className="w-full">
              <Link href={`/repartos/${reparto.id}`}>
                Ver Detalle
                <ArrowRight />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
