"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { procesarOrdenesDesdeTexto } from "@/app/acciones";
import type { Orden } from "@/tipos/orden";

export function FormularioOrden() {
  const [isPending, startTransition] = useTransition();
  const [textoOrdenes, setTextoOrdenes] = useState("");
  const [ordenes, setOrdenes] = useState<Orden[]>([]);

  const procesarOrdenes = () => {
    startTransition(async () => {
      const nuevasOrdenes = await procesarOrdenesDesdeTexto(textoOrdenes);
      setOrdenes(nuevasOrdenes);
    });
  };

  return (
    <div className="grid w-full gap-4">
      <Textarea
        placeholder="Pega aquí las órdenes para procesar."
        value={textoOrdenes}
        onChange={(e) => setTextoOrdenes(e.target.value)}
        rows={10}
        disabled={isPending}
      />
      <Button onClick={procesarOrdenes} disabled={isPending}>
        {isPending ? "Procesando..." : "Procesar Órdenes"}
      </Button>

      {ordenes.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Órdenes Procesadas
          </h2>
          {ordenes.map((orden, index) => (
            <Card key={index} className="w-full">
              <CardHeader>
                <CardTitle>{orden.empresa}</CardTitle>
                <CardDescription>
                  Horario de entrega: {orden.horarioEntrega}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <p>
                  <span className="font-semibold">Dirección de entrega: </span>
                  {orden.direccionEntrega}
                </p>
                {orden.montoACobrar && (
                  <p>
                    <span className="font-semibold">Monto a cobrar: </span>$
                    {orden.montoACobrar}
                  </p>
                )}
                {orden.notas && (
                  <p>
                    <span className="font-semibold">Notas: </span>
                    {orden.notas}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <p className="text-lg font-bold">
                  Costo del envío: ${orden.costoEnvio}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
