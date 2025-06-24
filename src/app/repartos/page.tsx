import type { Repartidor } from '@/tipos/repartidor';
import type { Orden } from '@/tipos/orden';
import type { RepartoExtendido } from '@/tipos/reparto';
import { GestionRepartos } from '@/components/gestion-repartos';
import { ListaRepartos } from '@/components/lista-repartos';
import { Separator } from '@/components/ui/separator';

const mockRepartidores: Repartidor[] = [
  { id: 1, nombre: 'Juan Perez' },
  { id: 2, nombre: 'Ana Gomez' },
];

const mockOrdenesPendientes: Orden[] = [
  { numeroOrden: 'ABC-1', destino: 'Calle Falsa 123, Mar del Plata, Provincia de Buenos Aires, Argentina', nombreClienteEntrega: 'Cliente 1', fecha: new Date(), horaDesde: '09:00:00', horaHasta: '12:00:00', nombreClienteRetiro: 'Tienda A', direccionRetiro: 'Av Siempre Viva 742, Mar del Plata, Provincia de Buenos Aires, Argentina', total: 1500, montoEnvio: 200, aclaraciones: 'Tocar timbre', estado: 'PENDIENTE' },
  { numeroOrden: 'DEF-2', destino: 'Av Corrientes 345, Mar del Plata, Provincia de Buenos Aires, Argentina', nombreClienteEntrega: 'Cliente 2', fecha: new Date(), horaDesde: '14:00:00', horaHasta: '18:00:00', nombreClienteRetiro: 'Tienda B', direccionRetiro: 'Av de Mayo 567, Mar del Plata, Provincia de Buenos Aires, Argentina', total: 2500, montoEnvio: 250, aclaraciones: 'Entregar en recepción', estado: 'PENDIENTE' },
];

const mockRepartosActuales: RepartoExtendido[] = [
    { id: 'REPO-1', fecha: new Date(), repartidorId: 1, repartidor: { id: 1, nombre: 'Juan Perez' }, _count: { ordenes: 5 } },
    { id: 'REPO-2', fecha: new Date(new Date().setDate(new Date().getDate() -1)), repartidorId: 2, repartidor: { id: 2, nombre: 'Ana Gomez' }, _count: { ordenes: 8 } },
];


export default function RepartosPage() {
  const repartidores = mockRepartidores;
  const ordenesPendientes = mockOrdenesPendientes;
  const repartosActuales = mockRepartosActuales;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Gestión de Repartos
      </h1>
      <GestionRepartos 
        repartidores={repartidores}
        ordenesPendientes={ordenesPendientes}
      />
      
      <Separator className="my-12" />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-6">
          Historial de Repartos
        </h2>
        <ListaRepartos repartos={repartosActuales} />
      </div>
    </div>
  );
}
