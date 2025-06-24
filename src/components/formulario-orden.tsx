"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function FormularioOrden() {
  return (
    <div className="grid w-full gap-4">
      <Textarea placeholder="Pega aquí las órdenes para procesar." />
      <Button>Procesar Órdenes</Button>
    </div>
  );
}
