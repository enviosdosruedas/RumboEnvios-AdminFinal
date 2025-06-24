"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Orden } from "@/tipos/orden";
import { format } from "date-fns";
import { Checkbox } from "./ui/checkbox";

interface OrdenesDisponiblesTablaProps {
  ordenes: Orden[];
}

export function OrdenesDisponiblesTabla({ ordenes }: OrdenesDisponiblesTablaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Órdenes Pendientes</CardTitle>
        <CardDescription>
          Selecciona las órdenes para incluir en el nuevo reparto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ordenes.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordenes.map((orden) => (
                  <TableRow key={orden.numeroOrden}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{orden.destino.split(',')[0]}</TableCell>
                    <TableCell>{orden.nombreClienteEntrega}</TableCell>
                    <TableCell>{format(new Date(orden.fecha), "dd/MM/yyyy")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed shadow-sm bg-card p-4">
            <div className="text-center">
              <p className="mt-2 text-base text-muted-foreground">
                No hay órdenes pendientes para asignar.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
