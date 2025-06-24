"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Orden } from "@/tipos/orden"
import { Checkbox } from "@/components/ui/checkbox"

interface TablaOrdenesSeleccionablesProps {
  ordenes: Orden[];
}

export function TablaOrdenesSeleccionables({ ordenes }: TablaOrdenesSeleccionablesProps) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const columns = React.useMemo<ColumnDef<Orden>[]>(() => [
      {
          id: "select",
          header: ({ table }) => (
              <Checkbox
                  checked={table.getIsAllPageRowsSelected()}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
              />
          ),
          cell: ({ row }) => (
              <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
              />
          ),
          enableSorting: false,
          enableHiding: false,
      },
      {
          accessorKey: "destino",
          header: "Destino",
          cell: ({ row }) => <div>{row.original.destino.split(',')[0]}</div>
      },
      {
          accessorKey: "nombreClienteEntrega",
          header: "Cliente",
      },
      {
          accessorKey: "fecha",
          header: "Fecha",
          cell: ({ row }) => format(new Date(row.getValue("fecha")), "dd/MM/yyyy"),
      },
  ], []);

  const table = useReactTable({
      data: ordenes,
      columns,
      state: {
          rowSelection,
      },
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
  });

  return (
      <Card>
          <CardHeader>
              <CardTitle>Órdenes Pendientes</CardTitle>
              <CardDescription>
              Selecciona las órdenes para incluir en el nuevo reparto.
              </CardDescription>
          </CardHeader>
          <CardContent>
              {ordenes.length > 0 ? (
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
                                      );
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
                                          <TableCell key={cell.id}>
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
              ) : (
                  <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed shadow-sm bg-card p-4">
                      <div className="text-center">
                      <p className="mt-2 text-base text-muted-foreground">
                          No hay órdenes pendientes para asignar.
                      </p>
                      </div>
                  </div>
              )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
            </div>
          </CardFooter>
      </Card>
  );
}
