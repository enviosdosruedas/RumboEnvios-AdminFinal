"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { procesarOrdenesDesdeTexto } from "@/app/acciones";
import type { Orden } from "@/tipos/orden";
import { TablaOrdenes } from "./tabla-ordenes";

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

      <div className="mt-6 space-y-4">
        {ordenes.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold tracking-tight">
              Órdenes Procesadas
            </h2>
            <TablaOrdenes datos={ordenes} />
          </>
        ) : (
          <p className="pt-4 text-center text-muted-foreground">
            Aún no se han procesado órdenes. Pega el texto en el área de arriba y presiona el botón.
          </p>
        )}
      </div>
    </div>
  );
}
