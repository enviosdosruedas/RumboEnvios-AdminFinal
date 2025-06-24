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
import { useToast } from "@/hooks/use-toast";
import { procesarOrdenesDesdeTexto } from "@/app/acciones";
import type { Orden } from "@/tipos/orden";

export function FormularioOrden() {
  const [isPending, startTransition] = useTransition();
  const [textoOrdenes, setTextoOrdenes] = useState("");
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const { toast } = useToast();

  const procesarOrdenes = () => {
    startTransition(async () => {
      const respuesta = await procesarOrdenesDesdeTexto(textoOrdenes);

      if (!respuesta.exito) {
        setOrdenes([]);
        toast({
          title: "Error al procesar",
          description: respuesta.error,
          variant: "destructive",
        });
        return;
      }
      
      setOrdenes(respuesta.datos);

      if (respuesta.datos.length === 0) {
        toast({
          title: "Sin resultados",
          description: "No se encontraron órdenes válidas en el texto.",
        });
      } else {
        toast({
          title: "¡Éxito!",
          description: `Se han procesado ${respuesta.datos.length} órdenes correctamente.`,
        });
      }
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
      <Button onClick={procesarOrdenes} disabled={isPending || !textoOrdenes.trim()}>
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
