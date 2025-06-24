"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FormularioOrdenProps {
  textoOrdenes: string;
  setTextoOrdenes: (value: string) => void;
  procesarOrdenes: () => void;
  isPending: boolean;
}

export function FormularioOrden({
  textoOrdenes,
  setTextoOrdenes,
  procesarOrdenes,
  isPending,
}: FormularioOrdenProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Procesar Nuevas Órdenes</CardTitle>
        <CardDescription>
          Pega el texto de las órdenes en el campo de abajo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-4">
          <Textarea
            placeholder="Pega aquí las órdenes para procesar..."
            value={textoOrdenes}
            onChange={(e) => setTextoOrdenes(e.target.value)}
            rows={15}
            disabled={isPending}
            className="text-sm"
          />
          <Button onClick={procesarOrdenes} disabled={isPending || !textoOrdenes.trim()}>
            {isPending ? "Procesando..." : "Procesar Órdenes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
