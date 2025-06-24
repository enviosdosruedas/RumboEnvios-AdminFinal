export type EstadoOrden = 'PENDIENTE' | 'RETIRADO' | 'EN_CAMINO' | 'COMPLETADO' | 'FALLIDO';

export interface Orden {
  numeroOrden: string;
  nombreClienteEntrega: string;
  destino: string;
  fecha: Date;
  horaHasta: string;
  nombreClienteRetiro: string;
  direccionRetiro: string;
  horaDesde: string;
  total: number;
  montoEnvio: number;
  aclaraciones: string;
  estado: EstadoOrden;
}
