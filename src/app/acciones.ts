'use server';

import prisma from '@/lib/prisma';
import type { Orden, EstadoOrden } from '@/tipos/orden';

function generarIdUnico(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

function normalizarHora(horaStr: string): string {
  let [horas, minutos] = horaStr.trim().split(/[:\s]+/);
  if (minutos === undefined) {
    minutos = '00';
  }
  horas = horas.padStart(2, '0');
  minutos = minutos.padEnd(2, '0').substring(0, 2);
  return `${horas}:${minutos}:00`;
}

function parsearHorario(rango: string): { horaDesde: string; horaHasta: string } {
  const rangoLimpio = rango.replace(/HS/i, '').trim();
  const partes = rangoLimpio.split(/\s+A\s+/i);
  if (partes.length === 2) {
    const horaDesde = normalizarHora(partes[0]);
    const horaHasta = normalizarHora(partes[1]);
    return {
      horaDesde,
      horaHasta,
    };
  }
  const horaNormalizada = normalizarHora(rangoLimpio);
  return { horaDesde: horaNormalizada, horaHasta: horaNormalizada };
}

function parsearNotas(notas: string | undefined): { nombreClienteEntrega: string; aclaraciones: string } {
  if (!notas) {
    return { nombreClienteEntrega: "A coordinar", aclaraciones: "" };
  }
  const partes = notas.split(/,\s*/);
  const nombreClienteEntrega = partes[0].trim() || "A coordinar";
  const aclaraciones = partes.slice(1).join(', ').trim();
  return { nombreClienteEntrega, aclaraciones };
}

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

      const nombreClienteRetiro = lineas[0].trim();
      const direccionRetiroCruda = lineas[1].replace(/RETIRA EN/i, '').trim();
      const direccionRetiro = direccionRetiroCruda + direccionSufijo;

      for (let i = 2; i < lineas.length; i++) {
        const lineaEnvio = lineas[i].trim();
        if (!lineaEnvio.startsWith('-')) continue;

        const regex = /^-\s*(?<horario>.+?hs)\s+(?<destino>.+?)\s*\.(?:\s*cobrar\s+\$(?<total>\d+)\s*\.\s*)?\s*env[ií]o\s+\$(?<montoEnvio>\d+)(?:\s*\((?<notas>.*)\))?$/i;
        
        const match = lineaEnvio.match(regex);

        if (match && match.groups) {
          const { horario, destino, total, montoEnvio, notas } = match.groups;
          
          const { horaDesde, horaHasta } = parsearHorario(horario);
          const { nombreClienteEntrega, aclaraciones } = parsearNotas(notas);
          
          const nuevaOrden: Orden = {
            numeroOrden: generarIdUnico(),
            nombreClienteEntrega,
            destino: destino.trim() + direccionSufijo,
            fecha: fechaActual,
            horaHasta,
            nombreClienteRetiro,
            direccionRetiro,
            horaDesde,
            total: Number(total || '0'),
            montoEnvio: Number(montoEnvio),
            aclaraciones,
            estado: 'PENDIENTE',
          };

          ordenes.push(nuevaOrden);
        }
      }
    }

    return { exito: true, datos: ordenes };
  } catch (error) {
    console.error("Error al procesar órdenes:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return { exito: false, error: `Hubo un problema al procesar el texto. Revisa el formato y la lógica de extracción. Detalles: ${errorMessage}` };
  }
}

export async function guardarOrdenes(ordenes: Orden[]): Promise<{ exito: boolean; error?: string }> {
  if (ordenes.length === 0) {
    return { exito: true };
  }
  
  try {
    const result = await prisma.orden.createMany({
      data: ordenes
    });

    console.log(`Se guardaron ${result.count} órdenes en la base de datos.`);
    return { exito: true };
  } catch (error) {
    console.error("Error al guardar órdenes en la base de datos:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al guardar en la base de datos";
    return { exito: false, error: errorMessage };
  }
}
