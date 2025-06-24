import { TablaOrdenes } from "@/components/tabla-ordenes";
import type { Orden } from "@/tipos/orden";

const mockOrdenes: Orden[] = [
    { numeroOrden: 'XYZ-123', estado: 'COMPLETADO', nombreClienteEntrega: 'John Doe', destino: '123 Main St, Mar del Plata, Provincia de Buenos Aires, Argentina', fecha: new Date(), horaDesde: '10:00:00', horaHasta: '12:00:00', nombreClienteRetiro: 'Warehouse A', direccionRetiro: '456 Industrial Ave, Mar del Plata, Provincia de Buenos Aires, Argentina', total: 100, montoEnvio: 10, aclaraciones: 'Leave at front door' },
    { numeroOrden: 'QWE-456', estado: 'FALLIDO', nombreClienteEntrega: 'Jane Smith', destino: '456 Oak Ave, Mar del Plata, Provincia de Buenos Aires, Argentina', fecha: new Date(), horaDesde: '14:00:00', horaHasta: '16:00:00', nombreClienteRetiro: 'Warehouse B', direccionRetiro: '789 Business Pkwy, Mar del Plata, Provincia de Buenos Aires, Argentina', total: 200, montoEnvio: 15, aclaraciones: 'Call upon arrival' },
    { numeroOrden: 'RTY-789', estado: 'ASIGNADO', nombreClienteEntrega: 'Peter Jones', destino: '789 Pine Ln, Mar del Plata, Provincia de Buenos Aires, Argentina', fecha: new Date(), horaDesde: '09:00:00', horaHasta: '11:00:00', nombreClienteRetiro: 'Warehouse C', direccionRetiro: '123 Commerce St, Mar del Plata, Provincia de Buenos Aires, Argentina', total: 300, montoEnvio: 20, aclaraciones: 'Fragile' }
];

export default function HistorialPage() {
  const ordenes = mockOrdenes;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Historial de Órdenes
      </h1>
      {ordenes.length > 0 ? (
        <TablaOrdenes datos={ordenes} />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed shadow-sm bg-card p-4">
          <div className="text-center">
            <p className="mt-2 text-base text-muted-foreground">
              No hay órdenes guardadas en el historial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
