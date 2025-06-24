"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { crearReparto } from "@/app/acciones";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Repartidor } from "@/tipos/repartidor";

interface FormularioCrearRepartoProps {
  repartidores: Repartidor[];
}

export function FormularioCrearReparto({ repartidores }: FormularioCrearRepartoProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [repartidorId, setRepartidorId] = useState<string>("");
  const [fecha, setFecha] = useState<Date>();

  const handleSubmit = () => {
    if (!repartidorId || !fecha) {
      toast({
        title: "Faltan datos",
        description: "Por favor, selecciona un repartidor y una fecha.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const result = await crearReparto({
        repartidorId: Number(repartidorId),
        fecha,
      });

      if (result.exito) {
        toast({
          title: "¡Éxito!",
          description: "El reparto ha sido creado correctamente.",
        });
        setRepartidorId("");
        setFecha(undefined);
      } else {
        toast({
          title: "Error al crear reparto",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Reparto</CardTitle>
        <CardDescription>
          Selecciona un repartidor, una fecha y luego las órdenes a asignar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="repartidor">Repartidor</Label>
            <Select
              onValueChange={setRepartidorId}
              value={repartidorId}
              disabled={isPending}
            >
              <SelectTrigger id="repartidor">
                <SelectValue placeholder="Selecciona un repartidor" />
              </SelectTrigger>
              <SelectContent>
                {repartidores.map((repartidor) => (
                  <SelectItem
                    key={repartidor.id}
                    value={String(repartidor.id)}
                  >
                    {repartidor.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha del Reparto</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="fecha"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fecha && "text-muted-foreground"
                  )}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fecha ? (
                    format(fecha, "PPP", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fecha}
                  onSelect={setFecha}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <p className="text-sm text-muted-foreground">
            A continuación, selecciona las órdenes de la tabla de la derecha.
          </p>

          <Button
            onClick={handleSubmit}
            disabled={!repartidorId || !fecha || isPending}
          >
            {isPending ? "Creando..." : "Crear Reparto"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
