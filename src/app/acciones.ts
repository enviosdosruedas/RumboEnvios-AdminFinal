'use server';

import type { Orden } from '@/tipos/orden';

type ProcesarOrdenesRespuesta = 
  | { exito: true; datos: Orden[] }
  | { exito: false; error: string };

export async function procesarOrdenesDesdeTexto(
  textoCrudo: string
): Promise<ProcesarOrdenesRespuesta> {
  try {
    const ordenes: Orden[] = [];
    const direccionSufijo = ", Mar del Plata, Provincia de Buenos Aires, Argentina";
    const fechaActual = new Date();

    if (!textoCrudo.trim()) {
      return { exito: true, datos: [] };
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

        const regex = /^-\s*(?<horarioEntrega>.+?),\s*(?<direccionEntrega>.+?),\s*(?:[a-z\s]*\$\s*(?<montoACobrar>\d+)\s*,\s*)?(?:[a-z\s]*\$\s*(?<costoEnvio>\d+))(?:\s*\((?<notas>.*)\))?$/i;
        
        const match = lineaEnvio.match(regex);

        if (match && match.groups) {
          const { horarioEntrega, direccionEntrega, montoACobrar, costoEnvio, notas } = match.groups;
          
          const nuevaOrden: Orden = {
            fecha: fechaActual,
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

    return { exito: true, datos: ordenes };
  } catch (error) {
    console.error("Error al procesar órdenes:", error);
    return { exito: false, error: "Hubo un problema al procesar el texto. Revisa el formato." };
  }
}
