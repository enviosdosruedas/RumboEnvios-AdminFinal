'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { asignarOrdenesAReparto } from '@/app/acciones';

import { FormularioCrearReparto } from './formulario-crear-reparto';
import { TablaOrdenesSeleccionables } from './tabla-ordenes-seleccionables';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Rocket } from "lucide-react";


import type { Repartidor } from '@/tipos/repartidor';
import type { Orden } from '@/tipos/orden';
import type { Reparto } from '@/tipos/reparto';

interface GestionRepartosProps {
  repartidores: Repartidor[];
  ordenesPendientes: Orden[];
}

export function GestionRepartos({ repartidores, ordenesPendientes }: GestionRepartosProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAssigning, startAssignTransition] = useTransition();

  const [repartoActivo, setRepartoActivo] = useState<Reparto | null>(null);
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState<Orden[]>([]);

  const handleRepartoCreado = useCallback((nuevoReparto: Reparto) => {
    setRepartoActivo(nuevoReparto);
  }, []);

  const handleSelectionChange = useCallback((ordenes: Orden[]) => {
    setOrdenesSeleccionadas(ordenes);
  }, []);

  const handleAsignarOrdenes = () => {
    if (!repartoActivo || ordenesSeleccionadas.length === 0) return;

    startAssignTransition(async () => {
      const ordenIds = ordenesSeleccionadas.map(o => o.numeroOrden);
      const result = await asignarOrdenesAReparto({
        repartoId: repartoActivo.id,
        ordenIds: ordenIds,
      });

      if (result.exito) {
        toast({ 
          title: '¡Éxito!', 
          description: `${result.count} órdenes han sido asignadas al reparto.` 
        });
        setRepartoActivo(null);
        setOrdenesSeleccionadas([]);
        router.refresh(); 
      } else {
        toast({ 
          title: 'Error al asignar', 
          description: result.mensaje, 
          variant: 'destructive' 
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <div className="lg:col-span-2 w-full lg:sticky lg:top-24 space-y-4">
        <FormularioCrearReparto 
          repartidores={repartidores} 
          onRepartoCreado={handleRepartoCreado} 
          repartoActivo={repartoActivo}
        />
        
        {repartoActivo && (
          <Card>
            <CardHeader>
              <CardTitle>3. Finalizar y Asignar</CardTitle>
              <CardDescription>
                Confirma para asignar las órdenes seleccionadas al reparto creado.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <Alert>
                    <Rocket className="h-4 w-4" />
                    <AlertTitle>¡Listo para la acción!</AlertTitle>
                    <AlertDescription>
                        Tienes <strong>{ordenesSeleccionadas.length}</strong> órdenes seleccionadas para asignar.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAsignarOrdenes}
                disabled={isAssigning || ordenesSeleccionadas.length === 0}
                className="w-full"
              >
                {isAssigning 
                  ? 'Asignando...' 
                  : `Asignar ${ordenesSeleccionadas.length} ${ordenesSeleccionadas.length === 1 ? 'Orden' : 'Órdenes'}`
                }
              </Button>
            </CardFooter>
          </Card>
        )}

      </div>
      <div className="lg:col-span-3 w-full">
        <TablaOrdenesSeleccionables 
          ordenes={ordenesPendientes} 
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
}
