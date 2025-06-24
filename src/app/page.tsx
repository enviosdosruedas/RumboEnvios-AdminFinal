"use client";

import { useState, useTransition } from "react";
import type { Orden } from "@/tipos/orden";
import { useToast } from "@/hooks/use-toast";
import { procesarOrdenesDesdeTexto } from "@/app/acciones";
import { FormularioOrden } from "@/components/formulario-orden";
import { TablaOrdenes } from "@/components/tabla-ordenes";

export default function Home() {
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

      if (respuesta.datos.length === 0 && textoOrdenes.trim().length > 0) {
        toast({
          title: "Sin resultados",
          description: "No se encontraron órdenes válidas en el texto.",
        });
      } else if (respuesta.datos.length > 0) {
        toast({
          title: "¡Éxito!",
          description: `Se han procesado ${respuesta.datos.length} órdenes correctamente.`,
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2 w-full">
          <FormularioOrden
            textoOrdenes={textoOrdenes}
            setTextoOrdenes={setTextoOrdenes}
            procesarOrdenes={procesarOrdenes}
            isPending={isPending}
          />
        </div>
        <div className="lg:col-span-3 w-full lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Órdenes Procesadas
          </h2>
          {ordenes.length > 0 ? (
            <TablaOrdenes datos={ordenes} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-card p-4">
              <div className="text-center">
                <p className="mt-2 text-base text-muted-foreground">
                  Los resultados aparecerán aquí una vez que proceses el texto.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
