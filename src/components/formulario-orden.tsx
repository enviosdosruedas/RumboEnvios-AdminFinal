"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { procesarOrdenesDesdeTexto } from "@/app/acciones";
import type { Orden } from "@/tipos/orden";

export function FormularioOrden() {
  const [textoOrdenes, setTextoOrdenes] = useState("");
  const [ordenes, setOrdenes] = useState<Orden[]>([]);

  const procesarOrdenes = async () => {
    const nuevasOrdenes = await procesarOrdenesDesdeTexto(textoOrdenes);
    setOrdenes(nuevasOrdenes);
  };

  return (
    <div className="grid w-full gap-4">
      <Textarea
        placeholder="Pega aquí las órdenes para procesar."
        value={textoOrdenes}
        onChange={(e) => setTextoOrdenes(e.target.value)}
        rows={10}
      />
      <Button onClick={procesarOrdenes}>Procesar Órdenes</Button>
    </div>
  );
}
