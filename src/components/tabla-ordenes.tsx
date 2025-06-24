"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Orden } from "@/tipos/orden"

interface TablaOrdenesProps {
  datos: Orden[]
}

export const columns: ColumnDef<Orden>[] = [
  {
    accessorKey: "numeroOrden",
    header: "Order Number",
  },
  {
    accessorKey: "nombreClienteEntrega",
    header: "Nombre Cliente Entrega",
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
    header: "HoraDesde",
  },
  {
    accessorKey: "horaHasta",
    header: "HoraHasta",
  },
  {
    accessorKey: "nombreClienteRetiro",
    header: "Nombre Cliente Retiro",
  },
  {
    accessorKey: "direccionRetiro",
    header: "Pick up address:",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${row.getValue("total")}`,
  },
  {
    accessorKey: "montoEnvio",
    header: "MontoEnvio",
    cell: ({ row }) => `$${row.getValue("montoEnvio")}`,
  },
  {
    accessorKey: "aclaraciones",
    header: "Aclaraciones",
  },
]

export function TablaOrdenes({ datos }: TablaOrdenesProps) {
  const table = useReactTable({
    data: datos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-xs">
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
  )
}
