
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Orden, EstadoOrden } from "@/tipos/orden"
import { useIsMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface TablaOrdenesProps {
  datos: Orden[]
}

const getStatusBadgeVariant = (estado?: EstadoOrden): "default" | "secondary" | "destructive" | "outline" => {
    switch (estado) {
        case 'PENDIENTE':
          return 'secondary';
        case 'ASIGNADO':
        case 'RETIRADO':
        case 'EN_CAMINO':
          return 'default';
        case 'COMPLETADO':
          return 'outline';
        case 'FALLIDO':
          return 'destructive';
        default:
          return 'secondary';
      }
}

const formatStatusText = (estado?: EstadoOrden): string => {
    if (!estado) {
        return "desconocido";
    }
    return estado.toLowerCase().replace('_', ' ');
}

export const columns: ColumnDef<Orden>[] = [
  {
    accessorKey: "numeroOrden",
    header: "Order #",
    cell: ({ row }) => {
        const numeroOrden = row.getValue("numeroOrden") as string;
        return (
            <div className="font-medium">
                #{numeroOrden.substring(0, 7)}
            </div>
        )
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
        const estado = row.getValue("estado") as EstadoOrden | undefined;
        return (
            <Badge variant={getStatusBadgeVariant(estado)} className="capitalize whitespace-nowrap">
                {formatStatusText(estado)}
            </Badge>
        );
    },
  },
  {
    accessorKey: "nombreClienteEntrega",
    header: "Cliente Entrega",
  },
  {
    accessorKey: "destino",
    header: "Destino",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => format(new Date(row.getValue("fecha")), "dd/MM/yyyy"),
  },
  {
    accessorKey: "horaDesde",
    header: "Desde",
  },
  {
    accessorKey: "horaHasta",
    header: "Hasta",
  },
  {
    accessorKey: "nombreClienteRetiro",
    header: "Cliente Retiro",
  },
  {
    accessorKey: "direccionRetiro",
    header: "Dirección Retiro",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${row.getValue("total")}`,
  },
  {
    accessorKey: "montoEnvio",
    header: "Envío",
    cell: ({ row }) => `$${row.getValue("montoEnvio")}`,
  },
  {
    accessorKey: "aclaraciones",
    header: "Aclaraciones",
  },
  {
    id: "acciones",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const orden = row.original;
      return (
        <div className="text-right">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/ordenes/${orden.numeroOrden}`}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Ver Detalle</span>
            </Link>
          </Button>
        </div>
      );
    },
  },
]

export function TablaOrdenes({ datos }: TablaOrdenesProps) {
  const isMobile = useIsMobile()
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: datos,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isMobile === undefined) {
      return (
          <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-card">
              <p className="text-muted-foreground">Cargando vista...</p>
          </div>
      );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        <Input
            placeholder="Buscar órdenes..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full"
          />
        {table.getRowModel().rows.map((row) => {
          const orden = row.original
          return (
            <Card key={orden.numeroOrden} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {orden.nombreClienteEntrega}
                </CardTitle>
                <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(orden.estado)} className="capitalize whitespace-nowrap">
                        {formatStatusText(orden.estado)}
                    </Badge>
                    <Link href={`/ordenes/${orden.numeroOrden}`} className="text-xs text-primary hover:underline">
                        #{orden.numeroOrden.substring(0, 7)}
                    </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{orden.destino.split(',')[0]}</div>
                <p className="text-xs text-muted-foreground">
                  Retira: {orden.nombreClienteRetiro}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Horario</span>
                    <span className="font-medium">{orden.horaDesde} - {orden.horaHasta}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Fecha</span>
                    <span className="font-medium">{format(new Date(orden.fecha), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Total a Cobrar</span>
                    <span className="font-medium">${orden.total}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Costo Envío</span>
                    <span className="font-medium">${orden.montoEnvio}</span>
                  </div>
                </div>
                {orden.aclaraciones && (
                  <div className="mt-4">
                    <span className="text-xs text-muted-foreground">Aclaraciones</span>
                    <p className="text-sm font-medium">{orden.aclaraciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            No se encontraron resultados para su búsqueda.
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
       <div className="flex items-center p-4">
        <Input
          placeholder="Filtrar todas las columnas..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2 text-xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
