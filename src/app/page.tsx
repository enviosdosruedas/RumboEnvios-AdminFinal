"use client";

import { useState, useTransition } from "react";
import type { Orden } from "@/tipos/orden";
import { useToast } from "@/hooks/use-toast";
import { procesarOrdenesDesdeTexto, guardarOrdenes } from "@/app/acciones";
import { FormularioOrden } from "@/components/formulario-orden";
import { TablaOrdenes } from "@/components/tabla-ordenes";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();
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
          description: respuesta.mensaje,
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

  const handleGuardarOrdenes = () => {
    startSaveTransition(async () => {
      if (ordenes.length === 0) return;
      
      const respuesta = await guardarOrdenes(ordenes);

      if (respuesta.exito) {
        toast({
          title: "Órdenes Guardadas",
          description: "Las órdenes se han guardado correctamente en la base de datos.",
        });
      } else {
        toast({
          title: "Error al Guardar",
          description: respuesta.mensaje,
          variant: "destructive",
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
            <>
              <TablaOrdenes datos={ordenes} />
              <div className="mt-4 flex justify-end">
                <Button onClick={handleGuardarOrdenes} disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar en Base de Datos"}
                </Button>
              </div>
            </>
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
