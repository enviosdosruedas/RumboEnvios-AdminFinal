'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import type { Orden, EstadoOrden } from '@/tipos/orden';
import type { Reparto } from '@/tipos/reparto';

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
  | { exito: false; mensaje: string };

export async function procesarOrdenesDesdeTexto(
  textoCrudo: string
): Promise<ProcesarOrdenesRespuesta> {
  if (!prisma) {
    return { exito: false, mensaje: "La conexión con la base de datos no está configurada." };
  }

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
    return { exito: false, mensaje: `Hubo un problema al procesar el texto. Revisa el formato y la lógica de extracción. Detalles: ${errorMessage}` };
  }
}

export async function guardarOrdenes(ordenes: Orden[]): Promise<{ exito: boolean; mensaje?: string }> {
  if (ordenes.length === 0) {
    return { exito: true };
  }

  if (!prisma) {
    return { exito: false, mensaje: "La conexión con la base de datos no está configurada." };
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
    return { exito: false, mensaje: errorMessage };
  }
}

export async function crearReparto({
  repartidorId,
  fecha,
}: {
  repartidorId: number;
  fecha: Date;
}): Promise<{ exito: boolean; reparto?: Reparto; mensaje?: string }> {
  if (!prisma) {
    return { exito: false, mensaje: "La conexión con la base de datos no está configurada." };
  }

  try {
    if (!repartidorId || !fecha) {
      return { exito: false, mensaje: "Faltan datos para crear el reparto." };
    }

    const nuevoReparto = await prisma.reparto.create({
      data: {
        fecha,
        repartidorId,
      },
    });

    return { exito: true, reparto: nuevoReparto };
  } catch (error) {
    console.error("Error al crear el reparto:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al crear el reparto";
    return { exito: false, mensaje: errorMessage };
  }
}

export async function asignarOrdenesAReparto({
  repartoId,
  ordenIds,
}: {
  repartoId: string;
  ordenIds: string[];
}): Promise<{ exito: boolean; count?: number; mensaje?: string }> {
  if (!prisma) {
    return { exito: false, mensaje: "La conexión con la base de datos no está configurada." };
  }
  
  try {
    if (!repartoId || ordenIds.length === 0) {
      return { exito: false, mensaje: "Faltan datos para asignar las órdenes." };
    }

    const result = await prisma.orden.updateMany({
      where: {
        numeroOrden: {
          in: ordenIds,
        },
      },
      data: {
        repartoId: repartoId,
        estado: 'ASIGNADO',
      },
    });

    return { exito: true, count: result.count };
  } catch (error) {
    console.error("Error al asignar órdenes al reparto:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al asignar órdenes";
    return { exito: false, mensaje: errorMessage };
  }
}

export async function crearRepartidor(nombre: string): Promise<{ exito: boolean; mensaje: string }> {
  if (!prisma) {
    return {
      exito: false,
      mensaje: "La conexión con la base de datos no está configurada.",
    };
  }

  try {
    if (!nombre || nombre.trim() === "") {
      return { exito: false, mensaje: "El nombre no puede estar vacío." };
    }

    await prisma.repartidor.create({
      data: {
        nombre: nombre.trim(),
      },
    });

    revalidatePath("/repartidores");

    return { exito: true, mensaje: "Repartidor creado con éxito." };
  } catch (error) {
    console.error("Error al crear repartidor:", error);
    
    if (error instanceof Error && (error as any).code === 'P2002') {
         return { exito: false, mensaje: 'Ya existe un repartidor con este nombre.' };
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Ocurrió un error desconocido.";
    return { exito: false, mensaje: `No se pudo crear el repartidor: ${errorMessage}` };
  }
}
