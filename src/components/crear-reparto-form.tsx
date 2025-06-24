"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Repartidor } from "@/tipos/repartidor";

interface CrearRepartoFormProps {
  repartidores: Repartidor[];
}

export function CrearRepartoForm({ repartidores }: CrearRepartoFormProps) {
  const [selectedRepartidor, setSelectedRepartidor] = useState<string>("");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Reparto</CardTitle>
        <CardDescription>
          Selecciona un repartidor y las órdenes a asignar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="repartidor">Repartidor</Label>
            <Select onValueChange={setSelectedRepartidor} value={selectedRepartidor}>
              <SelectTrigger id="repartidor">
                <SelectValue placeholder="Selecciona un repartidor" />
              </SelectTrigger>
              <SelectContent>
                {repartidores.map((repartidor) => (
                  <SelectItem key={repartidor.id} value={String(repartidor.id)}>
                    {repartidor.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Selecciona las órdenes de la tabla de la derecha.
          </p>
          <Button disabled={!selectedRepartidor}>
            Crear Reparto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
