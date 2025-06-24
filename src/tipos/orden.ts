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
}
