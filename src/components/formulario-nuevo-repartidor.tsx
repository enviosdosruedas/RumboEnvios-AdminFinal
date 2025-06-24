"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { crearRepartidor } from "@/app/acciones";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FormularioNuevoRepartidor() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [nombre, setNombre] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    startTransition(async () => {
      const resultado = await crearRepartidor(nombre);

      if (resultado.exito) {
        toast({
          title: "¡Éxito!",
          description: resultado.mensaje,
        });
        setNombre("");
      } else {
        toast({
          title: "Error al crear repartidor",
          description: resultado.mensaje,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Añadir Nuevo Repartidor</CardTitle>
        <CardDescription>
          Completa el formulario para registrar un nuevo repartidor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="nombre"
            placeholder="Nombre completo del repartidor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={isPending}
            required
          />
          <Button type="submit" disabled={isPending || !nombre.trim()} className="w-full">
            {isPending ? "Añadiendo..." : "Añadir Repartidor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
