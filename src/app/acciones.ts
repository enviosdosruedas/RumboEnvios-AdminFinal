'use server';

import type { Orden } from '@/tipos/orden';

export async function procesarOrdenesDesdeTexto(
  textoCrudo: string
): Promise<Orden[]> {
  const ordenes: Orden[] = [];
  const direccionSufijo = ", Mar del Plata, Provincia de Buenos Aires, Argentina";

  if (!textoCrudo) {
    return ordenes;
  }

  const bloquesEmpresas = textoCrudo.trim().split(/\n\s*\n/);

  for (const bloque of bloquesEmpresas) {
    const lineas = bloque.trim().split('\n');
    if (lineas.length < 2) continue;

    const empresa = lineas[0].trim();
    const direccionRetiro = lineas[1].trim() + direccionSufijo;

    for (let i = 2; i < lineas.length; i++) {
      const lineaEnvio = lineas[i].trim();
      if (!lineaEnvio.startsWith('-')) continue;

      const regex = /^-\s*(?<horarioEntrega>.+?),\s*(?<direccionEntrega>.+?),\s*(?:(?:\$\s*)(?<montoACobrar>\d+)\s*,\s*)?(?:\$\s*)(?<costoEnvio>\d+)(?:\s*\((?<notas>.*)\))?$/;
      
      const match = lineaEnvio.match(regex);

      if (match && match.groups) {
        const { horarioEntrega, direccionEntrega, montoACobrar, costoEnvio, notas } = match.groups;
        
        const nuevaOrden: Orden = {
          empresa: empresa,
          direccionRetiro: direccionRetiro,
          horarioEntrega: horarioEntrega.trim(),
          direccionEntrega: direccionEntrega.trim() + direccionSufijo,
          costoEnvio: Number(costoEnvio),
        };

        if (montoACobrar) {
          nuevaOrden.montoACobrar = Number(montoACobrar);
        }

        if (notas) {
          nuevaOrden.notas = notas.trim();
        }

        ordenes.push(nuevaOrden);
      }
    }
  }

  return ordenes;
}